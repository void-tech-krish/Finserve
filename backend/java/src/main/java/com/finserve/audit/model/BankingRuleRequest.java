package com.finserve.audit.model;

import java.util.List;

public class BankingRuleRequest {
    private List<String> variables;
    private List<List<String>> clauses;

    public List<String> getVariables() {
        return variables;
    }

    public void setVariables(List<String> variables) {
        this.variables = variables;
    }

    public List<List<String>> getClauses() {
        return clauses;
    }

    public void setClauses(List<List<String>> clauses) {
        this.clauses = clauses;
    }
}
