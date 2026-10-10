package com.finserve.audit.model;

import java.util.Map;

public class BankingRuleResponse {
    private boolean satisfiable;
    private String algorithm;
    private int variableCount;
    private int clauseCount;
    private Map<String, Boolean> assignment;

    public BankingRuleResponse(boolean satisfiable, String algorithm, int variableCount, int clauseCount, Map<String, Boolean> assignment) {
        this.satisfiable = satisfiable;
        this.algorithm = algorithm;
        this.variableCount = variableCount;
        this.clauseCount = clauseCount;
        this.assignment = assignment;
    }

    public boolean isSatisfiable() {
        return satisfiable;
    }

    public void setSatisfiable(boolean satisfiable) {
        this.satisfiable = satisfiable;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public int getVariableCount() {
        return variableCount;
    }

    public void setVariableCount(int variableCount) {
        this.variableCount = variableCount;
    }

    public int getClauseCount() {
        return clauseCount;
    }

    public void setClauseCount(int clauseCount) {
        this.clauseCount = clauseCount;
    }

    public Map<String, Boolean> getAssignment() {
        return assignment;
    }

    public void setAssignment(Map<String, Boolean> assignment) {
        this.assignment = assignment;
    }
}
