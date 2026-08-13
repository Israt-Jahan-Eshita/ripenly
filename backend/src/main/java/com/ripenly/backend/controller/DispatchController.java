package com.ripenly.backend.controller;

import com.ripenly.backend.dto.DispatchResponse;
import com.ripenly.backend.service.DispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dispatch")
@CrossOrigin(origins = "*")
public class DispatchController {

    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDispatches() {
        return ResponseEntity.ok(dispatchService.getAllDispatches());
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeDispatch(
            @RequestParam("files") java.util.List<MultipartFile> files,
            @RequestParam("produceType") String produceType,
            @RequestParam("quantity") BigDecimal quantity,
            @RequestParam("sourceLocation") String sourceLocation
    ) {
        try {
            DispatchResponse response = dispatchService.analyzeAndCreateDispatch(
                    files, produceType, quantity, sourceLocation);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null) {
                String lowerMsg = msg.toLowerCase();
                if (lowerMsg.contains("429") || lowerMsg.contains("quota") || lowerMsg.contains("limit")) {
                    return ResponseEntity.status(429).body(Map.of("error", "AI service limit reached. Please retry shortly."));
                }
                if (lowerMsg.contains("unavailable") || lowerMsg.contains("timeout")) {
                    return ResponseEntity.status(503).body(Map.of("error", "AI analysis is temporarily unavailable. Please try again."));
                }
            }
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "AI analysis is temporarily unavailable. Please try again."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "AI analysis is temporarily unavailable. Please try again."));
        }
    }

    @PostMapping("/nlp")
    public ResponseEntity<?> parseLogisticsNlp(@RequestParam("transcript") String transcript) {
        try {
            com.ripenly.backend.dto.NlpExtractionResult result = dispatchService.parseNlp(transcript);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to parse text via NLP."));
        }
    }
}
