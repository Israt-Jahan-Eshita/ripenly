package com.ripenly.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DispatchResponse {
    
    private Integer dispatchId;
    private String produceType;
    private BigDecimal quantity;
    private String sourceLocation;
    private String qualityGrade;
    private String qualityNotes;
    private List<Object> recommendedMarkets;
    private String expectedPriceRange;
    private Integer spoilageWindow;
    private String decision;
    private String decisionReason;
    private String dispatchPriority;
    private String confidence;
    private Double ervNow;
    private Double ervWait;
    private String forecastTrend;
    private Map<String, Integer> marketFactors;
    private String status;
    private Integer sampleCount;
    private String sampleGrades;

    public DispatchResponse() {}

    public Integer getDispatchId() { return dispatchId; }
    public void setDispatchId(Integer dispatchId) { this.dispatchId = dispatchId; }

    public String getProduceType() { return produceType; }
    public void setProduceType(String produceType) { this.produceType = produceType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getSourceLocation() { return sourceLocation; }
    public void setSourceLocation(String sourceLocation) { this.sourceLocation = sourceLocation; }

    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

    public String getQualityNotes() { return qualityNotes; }
    public void setQualityNotes(String qualityNotes) { this.qualityNotes = qualityNotes; }

    public List<Object> getRecommendedMarkets() { return recommendedMarkets; }
    public void setRecommendedMarkets(List<Object> recommendedMarkets) { this.recommendedMarkets = recommendedMarkets; }

    public String getExpectedPriceRange() { return expectedPriceRange; }
    public void setExpectedPriceRange(String expectedPriceRange) { this.expectedPriceRange = expectedPriceRange; }

    public Integer getSpoilageWindow() { return spoilageWindow; }
    public void setSpoilageWindow(Integer spoilageWindow) { this.spoilageWindow = spoilageWindow; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public String getDecisionReason() { return decisionReason; }
    public void setDecisionReason(String decisionReason) { this.decisionReason = decisionReason; }

    public String getDispatchPriority() { return dispatchPriority; }
    public void setDispatchPriority(String dispatchPriority) { this.dispatchPriority = dispatchPriority; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public Double getErvNow() { return ervNow; }
    public void setErvNow(Double ervNow) { this.ervNow = ervNow; }

    public Double getErvWait() { return ervWait; }
    public void setErvWait(Double ervWait) { this.ervWait = ervWait; }

    public String getForecastTrend() { return forecastTrend; }
    public void setForecastTrend(String forecastTrend) { this.forecastTrend = forecastTrend; }

    public Map<String, Integer> getMarketFactors() { return marketFactors; }
    public void setMarketFactors(Map<String, Integer> marketFactors) { this.marketFactors = marketFactors; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSampleCount() { return sampleCount; }
    public void setSampleCount(Integer sampleCount) { this.sampleCount = sampleCount; }

    public String getSampleGrades() { return sampleGrades; }
    public void setSampleGrades(String sampleGrades) { this.sampleGrades = sampleGrades; }
}
