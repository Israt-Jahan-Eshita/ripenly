package com.ripenly.backend.controller;

import com.ripenly.backend.service.DecisionEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/markets")
@CrossOrigin(origins = "*")
public class MarketController {

    private final DecisionEngineService decisionEngineService;

    public MarketController(DecisionEngineService decisionEngineService) {
        this.decisionEngineService = decisionEngineService;
    }

    @GetMapping
    public ResponseEntity<?> getAllMarkets() {
        return ResponseEntity.ok(decisionEngineService.getMockMarkets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMarketById(@PathVariable String id) {
        return decisionEngineService.getMockMarkets().stream()
                .filter(m -> id.equals(m.get("id")))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
