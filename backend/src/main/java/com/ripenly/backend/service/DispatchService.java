package com.ripenly.backend.service;

import com.ripenly.backend.dto.DispatchResponse;
import com.ripenly.backend.dto.GeminiQualityResult;
import com.ripenly.backend.entity.Agent;
import com.ripenly.backend.entity.Dispatch;
import com.ripenly.backend.repository.AgentRepository;
import com.ripenly.backend.repository.DispatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DispatchService {

    private final GeminiService geminiService;
    private final DispatchRepository dispatchRepository;
    private final AgentRepository agentRepository;
    private final DecisionEngineService decisionEngineService;

    public DispatchService(GeminiService geminiService, DispatchRepository dispatchRepository, AgentRepository agentRepository, DecisionEngineService decisionEngineService) {
        this.geminiService = geminiService;
        this.dispatchRepository = dispatchRepository;
        this.agentRepository = agentRepository;
        this.decisionEngineService = decisionEngineService;
    }

    public List<DispatchResponse> getAllDispatches() {
        return dispatchRepository.findAllByOrderByIdDesc().stream().map(dispatch -> {
            DispatchResponse response = new DispatchResponse();
            response.setDispatchId(dispatch.getId());
            response.setProduceType(dispatch.getProduceType());
            response.setQuantity(dispatch.getQuantity());
            response.setSourceLocation(dispatch.getSourceLocation());
            response.setQualityGrade(dispatch.getQualityGrade());
            response.setDecision(dispatch.getFinalDecision());
            if (dispatch.getExpectedPriceMin() != null && dispatch.getExpectedPriceMax() != null) {
                response.setExpectedPriceRange(String.format("Tk %.2f - %.2f", dispatch.getExpectedPriceMin(), dispatch.getExpectedPriceMax()));
            }
            response.setStatus(dispatch.getStatus());
            return response;
        }).toList();
    }

    public DispatchResponse analyzeAndCreateDispatch(List<MultipartFile> files, String produceType, BigDecimal quantity, String sourceLocation) {
        // 1. Input Validation
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("Please upload at least one produce image.");
        }
        if (files.size() > 5) {
            throw new IllegalArgumentException("Maximum of 5 images allowed per dispatch sample.");
        }
        if (produceType == null || produceType.trim().isEmpty()) {
            throw new IllegalArgumentException("Produce type is required.");
        }
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }
        if (sourceLocation == null || sourceLocation.trim().isEmpty()) {
            throw new IllegalArgumentException("Source location is required.");
        }

        // 2. Multi-sample Analysis with Duplicate Detection
        List<String> individualGrades = new ArrayList<>();
        StringBuilder combinedNotes = new StringBuilder();
        java.util.Set<String> imageHashes = new java.util.HashSet<>();
        
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                if (file.isEmpty()) continue;
                
                byte[] bytes = getBytesSafely(file);
                
                // Duplicate detection
                byte[] hashBytes = digest.digest(bytes);
                String hashStr = java.util.Base64.getEncoder().encodeToString(hashBytes);
                if (imageHashes.contains(hashStr)) {
                    throw new IllegalArgumentException("Duplicate image detected in sample batch. Please upload distinct photos.");
                }
                imageHashes.add(hashStr);

                // Analyze
                GeminiQualityResult qualityResult = geminiService.analyzeProduce(
                    bytes, 
                    file.getContentType(), 
                    produceType
                );
                
                individualGrades.add(qualityResult.getQualityGrade());
                combinedNotes.append("Sample ").append(i + 1).append(" (").append(qualityResult.getQualityGrade()).append("): ")
                             .append(qualityResult.getQualityNotes()).append("\n");
            }
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Hash algorithm not found", e);
        }

        if (individualGrades.isEmpty()) {
            throw new IllegalArgumentException("No valid images found in batch.");
        }

        // Aggregate Grade (Pessimistic Average)
        double totalScore = 0;
        for (String g : individualGrades) {
            if ("A".equals(g)) totalScore += 3;
            else if ("B".equals(g)) totalScore += 2;
            else if ("C".equals(g)) totalScore += 1;
        }
        double avgScore = totalScore / individualGrades.size();
        String compositeGrade = "C";
        if (avgScore >= 2.5) compositeGrade = "A";
        else if (avgScore >= 1.5) compositeGrade = "B";

        // 3. Setup Default Agent (for MVP)
        Agent agent = agentRepository.findById(1).orElseGet(() -> {
            Agent newAgent = new Agent("Demo Agent", "Dhaka");
            return agentRepository.save(newAgent);
        });

        // 4. Create and Save Dispatch (QUALITY_ASSESSED)
        Dispatch dispatch = new Dispatch();
        dispatch.setAgent(agent);
        dispatch.setProduceType(produceType);
        dispatch.setQuantity(quantity);
        dispatch.setSourceLocation(sourceLocation);
        dispatch.setQualityGrade(compositeGrade);
        dispatch.setQualityNotes(combinedNotes.toString().trim());
        dispatch.setSampleCount(individualGrades.size());
        dispatch.setSampleGrades(String.join(",", individualGrades));
        dispatch.setStatus("QUALITY_ASSESSED");

        dispatch = dispatchRepository.save(dispatch);

        // 5. Run Decision Engine (Phase 9B)
        int spoilageWindow = decisionEngineService.calculateSpoilageWindow(produceType, dispatch.getQualityGrade());
        dispatch.setSpoilageWindowHours(spoilageWindow);
        
        Map<String, Object> decisionResult = decisionEngineService.optimizeDispatch(dispatch, spoilageWindow);
        
        dispatch.setDecisionReason((String) decisionResult.get("decisionReason"));
        dispatch.setFinalDecision((String) decisionResult.get("decision"));
        dispatch.setDispatchPriority((String) decisionResult.get("dispatchPriority"));
        dispatch.setExpectedPriceMin((Double) decisionResult.get("expectedPriceMin"));
        dispatch.setExpectedPriceMax((Double) decisionResult.get("expectedPriceMax"));
        
        dispatch.setStatus("DECISION_READY");
        dispatch = dispatchRepository.save(dispatch);

        // 6. Map to API Contract
        DispatchResponse response = new DispatchResponse();
        response.setDispatchId(dispatch.getId());
        response.setProduceType(dispatch.getProduceType());
        response.setQuantity(dispatch.getQuantity());
        response.setSourceLocation(dispatch.getSourceLocation());
        response.setQualityGrade(dispatch.getQualityGrade());
        response.setQualityNotes(dispatch.getQualityNotes());
        response.setSampleCount(dispatch.getSampleCount());
        response.setSampleGrades(dispatch.getSampleGrades());
        response.setRecommendedMarkets((List<Object>) (Object) decisionResult.get("topMarkets"));
        
        if (dispatch.getExpectedPriceMin() != null && dispatch.getExpectedPriceMax() != null) {
            response.setExpectedPriceRange(String.format("Tk %.2f - %.2f", dispatch.getExpectedPriceMin(), dispatch.getExpectedPriceMax()));
        }
        
        response.setSpoilageWindow(dispatch.getSpoilageWindowHours());
        response.setDecision(dispatch.getFinalDecision());
        response.setDecisionReason(dispatch.getDecisionReason());
        response.setDispatchPriority(dispatch.getDispatchPriority());
        response.setConfidence((String) decisionResult.get("confidence"));
        response.setErvNow((Double) decisionResult.get("ervNow"));
        response.setErvWait((Double) decisionResult.get("ervWait"));
        response.setForecastTrend((String) decisionResult.get("forecastTrend"));
        response.setMarketFactors((Map<String, Integer>) decisionResult.get("marketFactors"));
        response.setStatus(dispatch.getStatus());

        return response;
    }

    private byte[] getBytesSafely(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read image file.");
        }
    }

    public com.ripenly.backend.dto.NlpExtractionResult parseNlp(String transcript) {
        return geminiService.extractLogisticsFromText(transcript);
    }
}
