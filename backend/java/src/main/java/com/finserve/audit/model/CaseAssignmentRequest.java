package com.finserve.audit.model;

import java.util.List;

public class CaseAssignmentRequest {
    private List<String> cases;
    private List<String> analysts;
    private List<Eligibility> eligibility;

    public List<String> getCases() {
        return cases;
    }

    public void setCases(List<String> cases) {
        this.cases = cases;
    }

    public List<String> getAnalysts() {
        return analysts;
    }

    public void setAnalysts(List<String> analysts) {
        this.analysts = analysts;
    }

    public List<Eligibility> getEligibility() {
        return eligibility;
    }

    public void setEligibility(List<Eligibility> eligibility) {
        this.eligibility = eligibility;
    }

    public static class Eligibility {
        private String caseId;
        private String analystId;

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
