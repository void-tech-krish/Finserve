package com.finserve.audit.model;

import java.util.List;

public class TransactionRankingRequest {
    private List<TransactionInput> transactions;

    public List<TransactionInput> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionInput> transactions) {
        this.transactions = transactions;
    }

    public static class TransactionInput {
        private String transactionId;
        private long amount;

        public String getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }

        public long getAmount() {
            return amount;
        }

        public void setAmount(long amount) {
            this.amount = amount;
        }
    }
}
