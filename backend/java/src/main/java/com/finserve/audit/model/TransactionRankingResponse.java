package com.finserve.audit.model;

import java.util.List;

public class TransactionRankingResponse {
    private String algorithm;
    private String order;
    private List<RankedTransaction> transactions;

    public TransactionRankingResponse(String algorithm, String order, List<RankedTransaction> transactions) {
        this.algorithm = algorithm;
        this.order = order;
        this.transactions = transactions;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public List<RankedTransaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<RankedTransaction> transactions) {
        this.transactions = transactions;
    }

    public static class RankedTransaction {
        private int rank;
        private String transactionId;
        private long amount;

        public RankedTransaction(int rank, String transactionId, long amount) {
            this.rank = rank;
            this.transactionId = transactionId;
            this.amount = amount;
        }

        public int getRank() {
            return rank;
        }

        public void setRank(int rank) {
            this.rank = rank;
        }

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
