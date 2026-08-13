package com.ripenly.backend.dto;

import java.math.BigDecimal;

public class NlpExtractionResult {
    private String produceType;
    private BigDecimal quantity;
    private String sourceLocation;

    public NlpExtractionResult() {}

    public String getProduceType() { return produceType; }
    public void setProduceType(String produceType) { this.produceType = produceType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getSourceLocation() { return sourceLocation; }
    public void setSourceLocation(String sourceLocation) { this.sourceLocation = sourceLocation; }
}
