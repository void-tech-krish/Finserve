package com.finserve.audit.model;

import java.util.List;

public class TransactionSamplingResponse {
    private int totalTransactions;
    private int sampleSize;
    private List<TransactionRecord> sampledTransactions;

    public TransactionSamplingResponse(int totalTransactions, int sampleSize, List<TransactionRecord> sampledTransactions) {
        this.totalTransactions = totalTransactions;
        this.sampleSize = sampleSize;
        this.sampledTransactions = sampledTransactions;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(int totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public int getSampleSize() {
        return sampleSize;
    }

    public void setSampleSize(int sampleSize) {
        this.sampleSize = sampleSize;
    }

    public List<TransactionRecord> getSampledTransactions() {
        return sampledTransactions;
    }

    public void setSampledTransactions(List<TransactionRecord> sampledTransactions) {
        this.sampledTransactions = sampledTransactions;
    }
}
