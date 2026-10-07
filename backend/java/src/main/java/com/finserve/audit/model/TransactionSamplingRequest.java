package com.finserve.audit.model;

import java.util.List;

public class TransactionSamplingRequest {
    private List<TransactionRecord> transactions;
    private int sampleSize;

    public List<TransactionRecord> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionRecord> transactions) {
        this.transactions = transactions;
    }

    public int getSampleSize() {
        return sampleSize;
    }

    public void setSampleSize(int sampleSize) {
        this.sampleSize = sampleSize;
    }
}
