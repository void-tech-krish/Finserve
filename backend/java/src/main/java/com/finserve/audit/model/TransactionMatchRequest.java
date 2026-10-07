package com.finserve.audit.model;

public class TransactionMatchRequest {
    private String transactionA;
    private String transactionB;
    private String algorithm;

    public String getTransactionA() {
        return transactionA;
    }

    public void setTransactionA(String transactionA) {
        this.transactionA = transactionA;
    }

    public String getTransactionB() {
        return transactionB;
    }

    public void setTransactionB(String transactionB) {
        this.transactionB = transactionB;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}
