package com.finserve.audit.model;

import java.util.List;

public class FraudDetectionResponse {
    private boolean fraudDetected;
    private List<MatchedPattern> matchedPatterns;
    private int matchCount;
    private String algorithm;
    private String complexity;

    public FraudDetectionResponse(boolean fraudDetected, List<MatchedPattern> matchedPatterns, int matchCount, String algorithm, String complexity) {
        this.fraudDetected = fraudDetected;
        this.matchedPatterns = matchedPatterns;
        this.matchCount = matchCount;
        this.algorithm = algorithm;
        this.complexity = complexity;
    }

    public boolean isFraudDetected() { return fraudDetected; }
    public List<MatchedPattern> getMatchedPatterns() { return matchedPatterns; }
    public int getMatchCount() { return matchCount; }
    public String getAlgorithm() { return algorithm; }
    public String getComplexity() { return complexity; }

    public static class MatchedPattern {
        private String pattern;
        private int position;

        public MatchedPattern(String pattern, int position) {
            this.pattern = pattern;
            this.position = position;
        }

        public String getPattern() { return pattern; }
        public int getPosition() { return position; }
    }
}
