package com.ripenly.backend.dto;

public class GeminiQualityResult {
    private String qualityGrade;
    private String qualityNotes;

    public GeminiQualityResult() {}

    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

    public String getQualityNotes() { return qualityNotes; }
    public void setQualityNotes(String qualityNotes) { this.qualityNotes = qualityNotes; }
}
