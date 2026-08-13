package com.ripenly.backend.controller;

import com.ripenly.backend.entity.MarketData;
import com.ripenly.backend.repository.MarketDataRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final MarketDataRepository marketDataRepository;

    public AdminController(MarketDataRepository marketDataRepository) {
        this.marketDataRepository = marketDataRepository;
    }

    @GetMapping("/markets")
    public ResponseEntity<List<MarketData>> getAllMarkets() {
        return ResponseEntity.ok(marketDataRepository.findAllByOrderByIdDesc());
    }

    @PostMapping("/markets")
    public ResponseEntity<?> createMarket(@RequestBody MarketData marketData) {
        if (marketData.getMarketName() == null || marketData.getMarketName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Market name is required."));
        }
        MarketData saved = marketDataRepository.save(marketData);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/markets/{id}")
    public ResponseEntity<?> updateMarket(@PathVariable Integer id, @RequestBody MarketData updated) {
        return marketDataRepository.findById(id).map(existing -> {
            if (updated.getMarketName() != null) existing.setMarketName(updated.getMarketName());
            if (updated.getProduceType() != null) existing.setProduceType(updated.getProduceType());
            if (updated.getPriceMin() != null) existing.setPriceMin(updated.getPriceMin());
            if (updated.getPriceMax() != null) existing.setPriceMax(updated.getPriceMax());
            if (updated.getArrivalVolume() != null) existing.setArrivalVolume(updated.getArrivalVolume());
            if (updated.getDemandScore() != null) existing.setDemandScore(updated.getDemandScore());
            if (updated.getTransportHours() != null) existing.setTransportHours(updated.getTransportHours());
            if (updated.getTransportCost() != null) existing.setTransportCost(updated.getTransportCost());
            if (updated.getGradeCompatibility() != null) existing.setGradeCompatibility(updated.getGradeCompatibility());
            if (updated.getSource() != null) existing.setSource(updated.getSource());
            if (updated.getDateRecorded() != null) existing.setDateRecorded(updated.getDateRecorded());
            return ResponseEntity.ok(marketDataRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/markets/{id}")
    public ResponseEntity<?> deleteMarket(@PathVariable Integer id) {
        if (!marketDataRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        marketDataRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Market data deleted."));
    }
}
