package com.ripenly.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_data")
public class MarketData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "market_name", nullable = false, length = 100)
    private String marketName;

    @Column(name = "produce_type", length = 50)
    private String produceType;

    @Column(name = "price_min")
    private Double priceMin;

    @Column(name = "price_max")
    private Double priceMax;

    @Column(name = "arrival_volume")
    private Double arrivalVolume;

    @Column(name = "demand_score")
    private Double demandScore;

    @Column(name = "transport_hours")
    private Double transportHours;

    @Column(name = "transport_cost")
    private Double transportCost;

    @Column(name = "grade_compatibility", length = 20)
    private String gradeCompatibility; // comma-separated: "A,B,C"

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "date_recorded")
    private LocalDate dateRecorded;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.dateRecorded == null) this.dateRecorded = LocalDate.now();
    }

    public MarketData() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getMarketName() { return marketName; }
    public void setMarketName(String marketName) { this.marketName = marketName; }
    public String getProduceType() { return produceType; }
    public void setProduceType(String produceType) { this.produceType = produceType; }
    public Double getPriceMin() { return priceMin; }
    public void setPriceMin(Double priceMin) { this.priceMin = priceMin; }
    public Double getPriceMax() { return priceMax; }
    public void setPriceMax(Double priceMax) { this.priceMax = priceMax; }
    public Double getArrivalVolume() { return arrivalVolume; }
    public void setArrivalVolume(Double arrivalVolume) { this.arrivalVolume = arrivalVolume; }
    public Double getDemandScore() { return demandScore; }
    public void setDemandScore(Double demandScore) { this.demandScore = demandScore; }
    public Double getTransportHours() { return transportHours; }
    public void setTransportHours(Double transportHours) { this.transportHours = transportHours; }
    public Double getTransportCost() { return transportCost; }
    public void setTransportCost(Double transportCost) { this.transportCost = transportCost; }
    public String getGradeCompatibility() { return gradeCompatibility; }
    public void setGradeCompatibility(String gradeCompatibility) { this.gradeCompatibility = gradeCompatibility; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public LocalDate getDateRecorded() { return dateRecorded; }
    public void setDateRecorded(LocalDate dateRecorded) { this.dateRecorded = dateRecorded; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
