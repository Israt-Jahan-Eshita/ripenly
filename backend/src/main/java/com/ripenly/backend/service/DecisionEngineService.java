package com.ripenly.backend.service;

import com.ripenly.backend.entity.Dispatch;
import com.ripenly.backend.entity.MarketData;
import com.ripenly.backend.repository.MarketDataRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
public class DecisionEngineService {

    private final MarketDataRepository marketDataRepository;

    public DecisionEngineService(MarketDataRepository marketDataRepository) {
        this.marketDataRepository = marketDataRepository;
    }
    // Simulated Perishability Rule Engine
    public int calculateSpoilageWindow(String produceType, String qualityGrade) {
        int baseWindowHours;
        
        // Base shelf life based on produce type
        if (produceType.toLowerCase().contains("tomato")) {
            baseWindowHours = 168; // 7 days
        } else if (produceType.toLowerCase().contains("mango")) {
            baseWindowHours = 240; // 10 days
        } else {
            baseWindowHours = 120; // 5 days generic
        }

        // Adjust based on visible quality grade
        if ("A".equals(qualityGrade)) {
            return baseWindowHours; // 100% of base
        } else if ("B".equals(qualityGrade)) {
            return (int) (baseWindowHours * 0.7); // 70% of base
        } else {
            return (int) (baseWindowHours * 0.3); // 30% of base (Grade C)
        }
    }

    // Static Market Dataset (For Phase 9B Step 1 as requested)
    public List<Map<String, Object>> getMockMarkets() {
        List<Map<String, Object>> markets = new ArrayList<>();
        
        markets.add(createMarket("M1", "Karwan Bazar Wholesale", 45.0, 0.9, 4.5, 20.0, List.of("A", "B")));
        markets.add(createMarket("M2", "Shyamoli Local Market", 38.0, 0.6, 1.2, 5.0, List.of("A", "B", "C")));
        markets.add(createMarket("M3", "Kawran Premium Export", 65.0, 1.2, 6.0, 35.0, List.of("A")));
        markets.add(createMarket("M4", "Mirpur City Market", 40.0, 0.8, 2.5, 12.0, List.of("A", "B")));
        
        return markets;
    }

    private Map<String, Object> createMarket(String id, String name, double price, double demand, double transportHours, double transportCost, List<String> grades) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", id);
        m.put("name", name);
        m.put("expectedPrice", price); // Price per kg
        m.put("demandScore", demand); // Multiplier
        m.put("transportHours", transportHours);
        m.put("transportCost", transportCost);
        m.put("gradeCompatibility", grades);
        return m;
    }

    private List<Map<String, Object>> getMarketsFromDb() {
        List<MarketData> dbMarkets = marketDataRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (MarketData md : dbMarkets) {
            double avgPrice = (md.getPriceMin() != null && md.getPriceMax() != null)
                    ? (md.getPriceMin() + md.getPriceMax()) / 2.0
                    : (md.getPriceMin() != null ? md.getPriceMin() : 0.0);
            List<String> grades = md.getGradeCompatibility() != null
                    ? List.of(md.getGradeCompatibility().split(","))
                    : List.of("A", "B", "C");
            result.add(createMarket(
                    "DB" + md.getId(),
                    md.getMarketName(),
                    avgPrice,
                    md.getDemandScore() != null ? md.getDemandScore() : 0.8,
                    md.getTransportHours() != null ? md.getTransportHours() : 3.0,
                    md.getTransportCost() != null ? md.getTransportCost() : 15.0,
                    grades
            ));
        }
        return result;
    }

    // Optimization Engine
    public Map<String, Object> optimizeDispatch(Dispatch dispatch, int spoilageWindowHours) {
        // Try DB market data first, fall back to mock if empty
        List<Map<String, Object>> allMarkets = getMarketsFromDb();
        if (allMarkets.isEmpty()) {
            allMarkets = getMockMarkets();
        }
        List<Map<String, Object>> evaluatedMarkets = new ArrayList<>();

        double bestValueNow = -1;
        double bestValueWait = -1;
        Map<String, Object> bestMarket = null;
        String decisionReason = "No compatible markets found.";
        String decisionAction = "WAIT";
        String dispatchPriority = "LOW";
        String confidence = "LOW";

        for (Map<String, Object> market : allMarkets) {
            List<String> compatibleGrades = (List<String>) market.get("gradeCompatibility");
            if (!compatibleGrades.contains(dispatch.getQualityGrade())) {
                continue; // Skip markets that don't accept this grade
            }

            double pricePerKg = (double) market.get("expectedPrice");
            double quantity = dispatch.getQuantity().doubleValue();
            double transportCost = (double) market.get("transportCost");
            double transportHours = (double) market.get("transportHours");
            double demandScore = (double) market.get("demandScore");

            // Calculate ERV if dispatched NOW
            double spoilageRiskNow = transportHours / spoilageWindowHours;
            double expectedSpoilageLossNow = (pricePerKg * quantity) * (spoilageRiskNow * 0.5);
            double delayPenaltyNow = transportHours * 2.0; 
            double expectedSellingValueNow = (pricePerKg * quantity) * demandScore;
            double expectedRealizedValueNow = expectedSellingValueNow - transportCost - expectedSpoilageLossNow - delayPenaltyNow;
            
            // Calculate ERV if we WAIT 24 hours (simulating 10% price bump, but much higher spoilage risk)
            double spoilageRiskWait = (transportHours + 24.0) / spoilageWindowHours;
            double expectedSpoilageLossWait = (pricePerKg * 1.1 * quantity) * (spoilageRiskWait * 0.5);
            double expectedSellingValueWait = (pricePerKg * 1.1 * quantity) * demandScore;
            double expectedRealizedValueWait = expectedSellingValueWait - transportCost - expectedSpoilageLossWait - delayPenaltyNow;

            Map<String, Object> eval = new HashMap<>(market);
            eval.put("expectedRealizedValue", expectedRealizedValueNow);
            eval.put("ervNow", expectedRealizedValueNow);
            eval.put("ervWait", expectedRealizedValueWait);
            eval.put("spoilageRiskNow", spoilageRiskNow);
            eval.put("spoilageRiskWait", spoilageRiskWait);
            evaluatedMarkets.add(eval);

            if (expectedRealizedValueNow > bestValueNow) {
                bestValueNow = expectedRealizedValueNow;
                bestValueWait = expectedRealizedValueWait;
                bestMarket = eval;
            }
        }

        // Sort by ERV descending
        evaluatedMarkets.sort((m1, m2) -> Double.compare(
                (double) m2.get("expectedRealizedValue"), 
                (double) m1.get("expectedRealizedValue")
        ));

        // Get Top 3
        List<Map<String, Object>> top3 = evaluatedMarkets.subList(0, Math.min(3, evaluatedMarkets.size()));

        if (bestMarket != null) {
            double margin = bestValueNow - bestValueWait;
            
            if (bestValueNow > bestValueWait) {
                decisionAction = "SELL_NOW";
                dispatchPriority = spoilageWindowHours < 72 ? "URGENT" : "NORMAL";
                confidence = margin > (bestValueNow * 0.05) ? "HIGH" : "MEDIUM";
                decisionReason = String.format(
                    "Market '%s' offers the highest ERV today (Tk %,.0f). Waiting 24h increases spoilage risk too much, dropping ERV to Tk %,.0f.",
                    bestMarket.get("name"), bestValueNow, bestValueWait
                );
            } else {
                decisionAction = "WAIT";
                dispatchPriority = "LOW";
                confidence = Math.abs(margin) > (bestValueWait * 0.05) ? "HIGH" : "MEDIUM";
                decisionReason = String.format(
                    "Holding produce for 24h yields a higher ERV (Tk %,.0f vs Tk %,.0f) due to rising demand at '%s', while remaining safely within the perishability window.",
                    bestValueWait, bestValueNow, bestMarket.get("name")
                );
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("topMarkets", top3);
        result.put("bestMarket", bestMarket);
        result.put("decision", decisionAction);
        result.put("decisionReason", decisionReason);
        result.put("dispatchPriority", dispatchPriority);
        result.put("confidence", confidence);
        result.put("ervNow", bestValueNow);
        result.put("ervWait", bestValueWait);
        result.put("forecastTrend", "+12.5% expected over next 30 days (Monsoon shortage)");
        
        // Calculate dynamic market factors (0-100 scores)
        Map<String, Integer> factors = new HashMap<>();
        if (bestMarket != null) {
            double dScore = (double) bestMarket.get("demandScore");
            factors.put("Demand", (int) Math.min(100, Math.max(0, (dScore / 1.5) * 100)));
            
            double price = (double) bestMarket.get("expectedPrice");
            factors.put("Price", (int) Math.min(100, Math.max(0, (price / 100.0) * 100)));
            
            double tHours = (double) bestMarket.get("transportHours");
            factors.put("Transport", (int) Math.max(0, 100 - (tHours * 5)));
            
            double sRiskNow = (double) bestMarket.get("spoilageRiskNow");
            factors.put("Spoilage Risk", (int) Math.max(0, 100 - (sRiskNow * 100)));
        } else {
            factors.put("Demand", 0);
            factors.put("Price", 0);
            factors.put("Transport", 0);
            factors.put("Spoilage Risk", 0);
        }
        result.put("marketFactors", factors);

        // Calculate expected price bounds
        double expectedBasePrice = bestMarket != null ? (double) bestMarket.get("expectedPrice") : 0.0;
        result.put("expectedPriceMin", expectedBasePrice * 0.95);
        result.put("expectedPriceMax", expectedBasePrice * 1.15);
        
        return result;
    }
}
