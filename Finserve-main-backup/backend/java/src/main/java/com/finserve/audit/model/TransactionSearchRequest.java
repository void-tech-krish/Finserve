package com.finserve.audit.model;

public class TransactionSearchRequest {
    private String transactionText;
    private String searchPattern;

    public String getTransactionText() {
        return transactionText;
    }

    public void setTransactionText(String transactionText) {
        this.transactionText = transactionText;
    }

    public String getSearchPattern() {
        return searchPattern;
    }

    public void setSearchPattern(String searchPattern) {
        this.searchPattern = searchPattern;
    }
}
