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
            "Grade only visible physical quality. Do not infer internal quality, pesticide residue, nutritional value, or food safety from an image. " +
            "Restrict grade to exactly 'A', 'B', or 'C'. Return a JSON array where each element corresponds to an image in order.", 
            files.size(), produceType
        );
        partsList.add(Map.of("text", promptText));

        for (org.springframework.web.multipart.MultipartFile file : files) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                partsList.add(Map.of("inline_data", Map.of(
                    "mime_type", file.getContentType(),
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
                        "qualityGrade", Map.of("type", "STRING", "enum", List.of("A", "B", "C")),
                        "qualityNotes", Map.of("type", "STRING")
                    ),
                    "required", List.of("qualityGrade", "qualityNotes")
                )
            )
        ));

        RuntimeException lastException = null;
        
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String currentKey = getKeyForAttempt(attempt);
                Map response = restClient.post()
                        .uri("/v1beta/models/gemini-1.5-flash:generateContent?key={key}", currentKey)
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
                        
                        // Manually parse JSON array
                        List<GeminiQualityResult> results = new java.util.ArrayList<>();
                        int currentIdx = 0;
                        while (true) {
                            int gradeIdx = jsonResult.indexOf("\"qualityGrade\"", currentIdx);
                            if (gradeIdx == -1) break;
                            
                            int gradeStart = jsonResult.indexOf("\"", gradeIdx + 14);
                            int gradeEnd = jsonResult.indexOf("\"", gradeStart + 1);
                            String grade = "C";
                            if (gradeStart != -1 && gradeEnd != -1) {
                                grade = jsonResult.substring(gradeStart + 1, gradeEnd);
                            }
                            
                            int notesIdx = jsonResult.indexOf("\"qualityNotes\"", currentIdx);
                            String notes = "Notes not parsed";
                            int finalNotesEnd = currentIdx; // declare here
                            if (notesIdx != -1) {
                                int notesStart = jsonResult.indexOf("\"", notesIdx + 14);
                                int notesEnd = jsonResult.indexOf("\"", notesStart + 1);
                                if (notesStart != -1 && notesEnd != -1) {
                                    notes = jsonResult.substring(notesStart + 1, notesEnd);
                                    finalNotesEnd = notesEnd;
                                }
                            }
                            
                            GeminiQualityResult res = new GeminiQualityResult();
                            res.setQualityGrade(grade);
                            res.setQualityNotes(notes);
                            results.add(res);
                            
                            currentIdx = Math.max(gradeEnd, finalNotesEnd) + 1;
                        }
                        
                        // Fallback if array parsing failed or mismatch
                        while (results.size() < files.size()) {
                            GeminiQualityResult fallback = new GeminiQualityResult();
                            fallback.setQualityGrade("B");
                            fallback.setQualityNotes("Batch processed, specific notes unavailable.");
                            results.add(fallback);
                        }
                        return results;
                    }
                }
                throw new RuntimeException("AI processing completed but yielded no content.");
            } catch (HttpClientErrorException.TooManyRequests e) {
                System.err.println("Gemini 429 (attempt " + attempt + "/" + MAX_RETRIES + "). Retrying...");
                lastException = new RuntimeException("AI Quota Exceeded. Please try again later.");
                if (attempt < MAX_RETRIES) sleepQuietly(BASE_DELAY_MS * (1L << (attempt - 1)));
            } catch (HttpClientErrorException | HttpServerErrorException e) {
                System.err.println("Gemini API Error (attempt " + attempt + "): " + e.getResponseBodyAsString());
                lastException = new RuntimeException("AI Service Error: " + e.getStatusCode());
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

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
