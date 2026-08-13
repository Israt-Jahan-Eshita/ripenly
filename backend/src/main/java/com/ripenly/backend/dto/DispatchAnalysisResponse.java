package com.ripenly.backend.dto;

public class DispatchAnalysisResponse {

    private Long dispatchId;
    private String produceType;
    private String qualityGrade;
    private String qualityNotes;
    
    public DispatchAnalysisResponse() {}

    public DispatchAnalysisResponse(Long dispatchId, String produceType, String qualityGrade, String qualityNotes) {
        this.dispatchId = dispatchId;
        this.produceType = produceType;
        this.qualityGrade = qualityGrade;
        this.qualityNotes = qualityNotes;
    }

    public Long getDispatchId() {
        return dispatchId;
    }

    public void setDispatchId(Long dispatchId) {
        this.dispatchId = dispatchId;
    }

    public String getProduceType() {
        return produceType;
    }

    public void setProduceType(String produceType) {
        this.produceType = produceType;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public String getQualityNotes() {
        return qualityNotes;
    }

    public void setQualityNotes(String qualityNotes) {
        this.qualityNotes = qualityNotes;
    }
}
