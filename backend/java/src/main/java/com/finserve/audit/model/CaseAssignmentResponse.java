package com.finserve.audit.model;

import java.util.List;

public class CaseAssignmentResponse {
    private String algorithm;
    private int totalCases;
    private int totalAnalysts;
    private int matchedCases;
    private List<Assignment> assignments;
    private List<String> unassignedCases;

    public CaseAssignmentResponse(String algorithm, int totalCases, int totalAnalysts, int matchedCases, List<Assignment> assignments, List<String> unassignedCases) {
        this.algorithm = algorithm;
        this.totalCases = totalCases;
        this.totalAnalysts = totalAnalysts;
        this.matchedCases = matchedCases;
        this.assignments = assignments;
        this.unassignedCases = unassignedCases;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public int getTotalCases() {
        return totalCases;
    }

    public void setTotalCases(int totalCases) {
        this.totalCases = totalCases;
    }

    public int getTotalAnalysts() {
        return totalAnalysts;
    }

    public void setTotalAnalysts(int totalAnalysts) {
        this.totalAnalysts = totalAnalysts;
    }

    public int getMatchedCases() {
        return matchedCases;
    }

    public void setMatchedCases(int matchedCases) {
        this.matchedCases = matchedCases;
    }

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    public List<String> getUnassignedCases() {
        return unassignedCases;
    }

    public void setUnassignedCases(List<String> unassignedCases) {
        this.unassignedCases = unassignedCases;
    }

    public static class Assignment {
        private String caseId;
        private String analystId;

        public Assignment(String caseId, String analystId) {
            this.caseId = caseId;
            this.analystId = analystId;
        }

        public String getCaseId() {
            return caseId;
        }

        public void setCaseId(String caseId) {
            this.caseId = caseId;
        }

        public String getAnalystId() {
            return analystId;
        }

        public void setAnalystId(String analystId) {
            this.analystId = analystId;
        }
    }
}
