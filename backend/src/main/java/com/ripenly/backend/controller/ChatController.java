package com.ripenly.backend.controller;

import com.ripenly.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<?> handleChat(@RequestBody Map<String, String> request) {
        try {
            String context = request.getOrDefault("context", "General website inquiry.");
            String message = request.get("message");
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
            }

            String response = geminiService.explainDecision(context, message);
            return ResponseEntity.ok(Map.of("reply", response));
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Quota") || msg.contains("503") || msg.contains("Unavailable"))) {
                return ResponseEntity.status(503).body(Map.of("reply", "I'm currently experiencing high demand. Please try again in a moment."));
            }
            return ResponseEntity.ok(Map.of("reply", "I can only help with questions about Ripenly dispatches and produce routing. Could you rephrase your question?"));
        }
    }
}
