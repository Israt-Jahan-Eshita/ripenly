package com.ripenly.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final String apiKey;

    public GeminiService(@Value("${GEMINI_API_KEY}") String apiKey) {
        this.apiKey = apiKey;
        // The browser never sees this; our backend safely makes the call
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("Api-Revision", "2026-05-20")
                .build();
    }

    public String testTextCall() {
        // Smallest possible test: just text
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "role", "user",
                    "parts", List.of(
                        Map.of("text", "Say hello in exactly two words!")
                    )
                )
            )
        );

        try {
            Map response = restClient.post()
                    .uri("/v1beta/interactions?key={key}", this.apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            // Instead of trying to parse it blindly right away, we will return 
            // the raw Map as a string. This lets us verify auth works AND visually 
            // inspect the new 'steps[]' structure before we write the parsing logic!
            return response.toString();
            
        } catch (Exception e) {
            return "API Call Failed: " + e.getMessage();
        }
    }
}
