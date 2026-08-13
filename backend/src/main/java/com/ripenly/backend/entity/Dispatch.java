package com.ripenly.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispatches")
public class Dispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private Agent agent;

    // Maps to existing "produce" column (varchar(50))
    @Column(name = "produce", nullable = false, length = 50)
    private String produceType;

    // Maps to existing "quantity" column (numeric(10,2))
    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal quantity;

    // Maps to existing "quality_grade" column (varchar(10))
    @Column(name = "quality_grade", length = 10)
    private String qualityGrade;

    // Maps to new "quality_notes" column (text)
    @Column(name = "quality_notes", columnDefinition = "TEXT")
    private String qualityNotes;

    // Maps to existing "spoilage_window_hours" column (integer)
    @Column(name = "spoilage_window_hours")
    private Integer spoilageWindowHours;

    // Maps to existing "recommended_market_id" column (integer FK)
    @Column(name = "recommended_market_id", insertable = false, updatable = false)
    private Integer recommendedMarketId;

    // Maps to existing "final_decision" column (varchar(50))
    @Column(name = "final_decision", length = 50)
    private String finalDecision;

    // Maps to new "source_location" column (varchar(255))
    @Column(name = "source_location")
    private String sourceLocation;

    // Maps to new "decision_reason" column (text)
    @Column(name = "decision_reason", columnDefinition = "TEXT")
    private String decisionReason;

    // Maps to new "expected_price_min" column
    @Column(name = "expected_price_min")
    private Double expectedPriceMin;

    // Maps to new "expected_price_max" column
    @Column(name = "expected_price_max")
    private Double expectedPriceMax;

    // Maps to new "status" column
    @Column(name = "status", length = 50)
    private String status;

    // Maps to new "dispatch_priority" column
    @Column(name = "dispatch_priority", length = 50)
    private String dispatchPriority;

    @Column(name = "sample_count")
    private Integer sampleCount;

    @Column(name = "sample_grades", length = 50)
    private String sampleGrades;

    // Maps to existing "created_at" column
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Dispatch() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }

    public String getProduceType() { return produceType; }
    public void setProduceType(String produceType) { this.produceType = produceType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

    public String getQualityNotes() { return qualityNotes; }
    public void setQualityNotes(String qualityNotes) { this.qualityNotes = qualityNotes; }

    public Integer getSpoilageWindowHours() { return spoilageWindowHours; }
    public void setSpoilageWindowHours(Integer spoilageWindowHours) { this.spoilageWindowHours = spoilageWindowHours; }

    public Integer getRecommendedMarketId() { return recommendedMarketId; }
    public void setRecommendedMarketId(Integer recommendedMarketId) { this.recommendedMarketId = recommendedMarketId; }

    public String getFinalDecision() { return finalDecision; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }

    public String getSourceLocation() { return sourceLocation; }
    public void setSourceLocation(String sourceLocation) { this.sourceLocation = sourceLocation; }

    public String getDecisionReason() { return decisionReason; }
    public void setDecisionReason(String decisionReason) { this.decisionReason = decisionReason; }

    public Double getExpectedPriceMin() { return expectedPriceMin; }
    public void setExpectedPriceMin(Double expectedPriceMin) { this.expectedPriceMin = expectedPriceMin; }

    public Double getExpectedPriceMax() { return expectedPriceMax; }
    public void setExpectedPriceMax(Double expectedPriceMax) { this.expectedPriceMax = expectedPriceMax; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDispatchPriority() { return dispatchPriority; }
    public void setDispatchPriority(String dispatchPriority) { this.dispatchPriority = dispatchPriority; }

    public Integer getSampleCount() { return sampleCount; }
    public void setSampleCount(Integer sampleCount) { this.sampleCount = sampleCount; }

    public String getSampleGrades() { return sampleGrades; }
    public void setSampleGrades(String sampleGrades) { this.sampleGrades = sampleGrades; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
