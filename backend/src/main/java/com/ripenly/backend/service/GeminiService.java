package com.ripenly.backend.service;

import com.ripenly.backend.dto.GeminiQualityResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.List;
import java.util.Base64;
import java.util.HashMap;

@Service
public class GeminiService {

    private static final int MAX_RETRIES = 3;
    private static final long BASE_DELAY_MS = 2000;

    private final RestClient restClient;
    private final String[] apiKeys;

    public GeminiService(
            @Value("${GEMINI_API_KEY}") String apiKey,
            @Value("${GEMINI_API_KEY_BACKUP:}") String backupKey) {
        if (backupKey != null && !backupKey.isBlank()) {
            this.apiKeys = new String[]{apiKey, backupKey};
        } else {
            this.apiKeys = new String[]{apiKey};
        }
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    private String getKeyForAttempt(int attempt) {
        return apiKeys[(attempt - 1) % apiKeys.length];
    }

    public List<GeminiQualityResult> analyzeProduceBatch(List<org.springframework.web.multipart.MultipartFile> files, String produceType) {
        List<Map<String, Object>> partsList = new java.util.ArrayList<>();
        
        String promptText = String.format(
            "Act as an expert agricultural inspector. Analyze these %d images of a %s. " +
            "First, determine if the image actually contains the requested produce type (%s). If it does not, set 'isRequestedProduce' to false. " +
            "If it is the requested produce, grade only visible physical quality (A, B, or C). " +
            "Return a JSON array where each element corresponds to an image in order.", 
            files.size(), produceType, produceType
        );
        partsList.add(Map.of("text", promptText));

        for (org.springframework.web.multipart.MultipartFile file : files) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                String mimeType = file.getContentType();
                if (mimeType == null || !mimeType.startsWith("image/")) {
                    mimeType = "image/jpeg"; // Fallback for Gemini
                }
                partsList.add(Map.of("inlineData", Map.of(
                    "mimeType", mimeType,
                    "data", base64Image
                )));
            } catch (Exception e) {
                throw new RuntimeException("Failed to read image bytes");
            }
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(Map.of("parts", partsList)));
        requestBody.put("generationConfig", Map.of(
            "responseMimeType", "application/json",
            "responseSchema", Map.of(
                "type", "ARRAY",
                "items", Map.of(
                    "type", "OBJECT",
                    "properties", Map.of(
                        "isRequestedProduce", Map.of("type", "BOOLEAN"),
                        "qualityGrade", Map.of("type", "STRING", "enum", List.of("A", "B", "C")),
                        "qualityNotes", Map.of("type", "STRING")
                    ),
                    "required", List.of("isRequestedProduce", "qualityGrade", "qualityNotes")
                )
            )
        ));

        RuntimeException lastException = null;
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String currentKey = getKeyForAttempt(attempt);
                Map response = restClient.post()
                        .uri("/v1beta/models/gemini-3.1-flash-image:generateContent?key={key}", currentKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String jsonResult = (String) parts.get(0).get("text");
                        
                        try {
                            List<Map<String, Object>> parsedArray = mapper.readValue(
                                jsonResult, 
                                new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>(){}
                            );
                            
                            List<GeminiQualityResult> results = new java.util.ArrayList<>();
                            for (Map<String, Object> item : parsedArray) {
                                Boolean isProduce = (Boolean) item.get("isRequestedProduce");
                                if (isProduce != null && !isProduce) {
                                    throw new IllegalArgumentException("Image rejected: One or more uploaded photos do not appear to be a " + produceType + ". Please upload valid produce photos.");
                                }
                                
                                GeminiQualityResult res = new GeminiQualityResult();
                                res.setQualityGrade((String) item.getOrDefault("qualityGrade", "C"));
                                res.setQualityNotes((String) item.getOrDefault("qualityNotes", "Could not analyze notes."));
                                results.add(res);
                            }
                            
                            // Fallback if missing elements
                            while (results.size() < files.size()) {
                                GeminiQualityResult fallback = new GeminiQualityResult();
                                fallback.setQualityGrade("B");
                                fallback.setQualityNotes("Batch processed, specific notes unavailable.");
                                results.add(fallback);
                            }
                            
                            return results;
                        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                            throw new RuntimeException("Failed to parse AI response JSON.", e);
                        }
                    }
                }
                throw new RuntimeException("AI processing completed but yielded no content.");
            } catch (HttpClientErrorException.TooManyRequests e) {
                System.err.println("Gemini 429 (attempt " + attempt + "/" + MAX_RETRIES + "). Retrying...");
                lastException = new RuntimeException("AI Quota Exceeded. Please try again later.");
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (HttpClientErrorException | HttpServerErrorException e) {
                System.err.println("Gemini API Error (attempt " + attempt + "): " + e.getResponseBodyAsString());
                lastException = new RuntimeException("AI Service Error: " + e.getResponseBodyAsString());
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (ResourceAccessException e) {
                lastException = new RuntimeException("AI Service Timeout or Unavailable.");
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (RuntimeException e) {
                throw e; // Non-retryable
            }
        }
        throw lastException != null ? lastException : new RuntimeException("AI analysis failed after retries.");
    }

    public com.ripenly.backend.dto.NlpExtractionResult extractLogisticsFromText(String transcript) {
        String promptText = "Extract the following details from this text: produce type, quantity (as a number in kg, default to 0 if unknown), and source location. " +
                            "Text: \"" + transcript + "\"";

        Map<String, Object> requestBody = new HashMap<>();
        
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(
                Map.of("text", promptText)
            ))
        ));
        
        requestBody.put("generationConfig", Map.of(
            "responseMimeType", "application/json",
            "responseSchema", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "produceType", Map.of("type", "STRING"),
                    "quantity", Map.of("type", "NUMBER"),
                    "sourceLocation", Map.of("type", "STRING")
                ),
                "required", List.of("produceType", "quantity", "sourceLocation")
            )
        ));

        RuntimeException lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String currentKey = getKeyForAttempt(attempt);
                Map response = restClient.post()
                        .uri("/v1beta/models/gemini-3.5-flash:generateContent?key={key}", currentKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String jsonResult = (String) parts.get(0).get("text");
                        com.ripenly.backend.dto.NlpExtractionResult result = new com.ripenly.backend.dto.NlpExtractionResult();
                        result.setProduceType("Unknown");
                        result.setQuantity(java.math.BigDecimal.ZERO);
                        result.setSourceLocation("Unknown");
                        
                        String prodStr = extractJsonValue(jsonResult, "produceType");
                        if (prodStr != null) result.setProduceType(prodStr);
                        
                        String locStr = extractJsonValue(jsonResult, "sourceLocation");
                        if (locStr != null) result.setSourceLocation(locStr);
                        
                        String qtyStr = extractJsonNumber(jsonResult, "quantity");
                        if (qtyStr != null) {
                            try {
                                result.setQuantity(new java.math.BigDecimal(qtyStr));
                            } catch(Exception e){}
                        }
                        return result;
                    }
                }
                throw new RuntimeException("AI yielded no content");
            } catch (HttpClientErrorException.TooManyRequests e) {
                System.err.println("Gemini NLP 429 (attempt " + attempt + "/" + MAX_RETRIES + "). Retrying...");
                lastException = new RuntimeException("AI Quota Exceeded. Please try again later.");
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (HttpClientErrorException | HttpServerErrorException e) {
                System.err.println("Gemini NLP Error (attempt " + attempt + "): " + e.getResponseBodyAsString());
                lastException = new RuntimeException("AI Service Error: " + e.getStatusCode());
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (RuntimeException e) {
                throw e;
            }
        }
        throw lastException != null ? lastException : new RuntimeException("NLP extraction failed after retries.");
    }
    
    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int keyIdx = json.indexOf(searchKey);
        if (keyIdx != -1) {
            int startQuote = json.indexOf("\"", keyIdx + searchKey.length());
            if (startQuote != -1) {
                int endQuote = json.indexOf("\"", startQuote + 1);
                if (endQuote > startQuote) {
                    return json.substring(startQuote + 1, endQuote);
                }
            }
        }
        return null;
    }
    
    private String extractJsonNumber(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int keyIdx = json.indexOf(searchKey);
        if (keyIdx != -1) {
            int start = keyIdx + searchKey.length();
            while(start < json.length() && Character.isWhitespace(json.charAt(start))) start++;
            int end = start;
            while(end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.')) end++;
            if (end > start) {
                return json.substring(start, end);
            }
        }
        return null;
    }

    public String explainDecision(String context, String userMessage) {
        String promptText = "You are the AI Assistant for Ripenly, a smart B2B supply chain platform for farmers. " +
                            "Context of the specific dispatch the user is asking about: " + context + "\n" +
                            "User message: " + userMessage + "\n" +
                            "Instructions:\n" +
                            "1. Briefly explain the AI routing decision in plain language based on the context above.\n" +
                            "2. Do NOT answer any questions outside the scope of agriculture, Ripenly, or this specific dispatch.\n" +
                            "3. Keep your response helpful, professional, and concise (under 4 sentences if possible).";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(
                Map.of("text", promptText)
            ))
        ));

        RuntimeException lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String currentKey = getKeyForAttempt(attempt);
                Map response = restClient.post()
                        .uri("/v1beta/models/gemini-3.5-flash:generateContent?key={key}", currentKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
                throw new RuntimeException("AI yielded no content");
            } catch (HttpClientErrorException.TooManyRequests e) {
                System.err.println("Gemini Chat 429 (attempt " + attempt + "/" + MAX_RETRIES + "). Retrying...");
                lastException = new RuntimeException("AI Quota Exceeded. Please try again later.");
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (HttpClientErrorException | HttpServerErrorException e) {
                System.err.println("Gemini Chat Error (attempt " + attempt + "): " + e.getResponseBodyAsString());
                lastException = new RuntimeException("AI Service Error: " + e.getStatusCode());
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (RuntimeException e) {
                throw e;
            }
        }
        throw lastException != null ? lastException : new RuntimeException("Chat explanation failed after retries.");
    }

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
