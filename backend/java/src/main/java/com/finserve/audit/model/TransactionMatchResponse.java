package com.finserve.audit.model;

public class TransactionMatchResponse {
    private String transactionA;
    private String transactionB;
    private String algorithm;
    private int distance;
    private boolean matched;

    public TransactionMatchResponse(String transactionA, String transactionB, String algorithm, int distance, boolean matched) {
        this.transactionA = transactionA;
        this.transactionB = transactionB;
        this.algorithm = algorithm;
        this.distance = distance;
        this.matched = matched;
    }

    public String getTransactionA() { return transactionA; }
    public String getTransactionB() { return transactionB; }
    public String getAlgorithm() { return algorithm; }
    public int getDistance() { return distance; }
    public boolean isMatched() { return matched; }
}
