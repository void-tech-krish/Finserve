package com.finserve.audit.model;

public class TransactionSearchResponse {
    private boolean found;
    private String pattern;
    private int position;
    private String algorithm;
    private String complexity;

    public TransactionSearchResponse(boolean found, String pattern, int position, String algorithm, String complexity) {
        this.found = found;
        this.pattern = pattern;
        this.position = position;
        this.algorithm = algorithm;
        this.complexity = complexity;
    }

    public boolean isFound() { return found; }
    public String getPattern() { return pattern; }
    public int getPosition() { return position; }
    public String getAlgorithm() { return algorithm; }
    public String getComplexity() { return complexity; }
}
