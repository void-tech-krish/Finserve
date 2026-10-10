package com.finserve.audit.model;

import java.util.List;

public class FraudDetectionRequest {
    private String transactionText;
    private List<String> fraudPatterns;

    public String getTransactionText() {
        return transactionText;
    }

    public void setTransactionText(String transactionText) {
        this.transactionText = transactionText;
    }

    public List<String> getFraudPatterns() {
        return fraudPatterns;
    }

    public void setFraudPatterns(List<String> fraudPatterns) {
        this.fraudPatterns = fraudPatterns;
    }
}
