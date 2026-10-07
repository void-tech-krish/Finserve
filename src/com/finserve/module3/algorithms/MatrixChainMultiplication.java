package com.finserve.module3.algorithms;

public class MatrixChainMultiplication {

    public static class MCMResult {
        public int minCost;
        public String optimalOrder;

        public MCMResult(int minCost, String optimalOrder) {
            this.minCost = minCost;
            this.optimalOrder = optimalOrder;
        }
    }

    public static MCMResult minimumMultiplicationCost(int[] p) {
        if (p == null || p.length <= 1) {
            return new MCMResult(0, "");
        }
        if (p.length == 2) {
            return new MCMResult(0, "A1");
        }

        int n = p.length - 1;
        int[][] dp = new int[n + 1][n + 1];
        int[][] split = new int[n + 1][n + 1];

        for (int i = 1; i <= n; i++) {
            dp[i][i] = 0;
        }

        for (int len = 2; len <= n; len++) {
            for (int i = 1; i <= n - len + 1; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;

                for (int k = i; k <= j - 1; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        split[i][j] = k;
                    }
                }
            }
        }

        String optimalOrder = reconstructOptimalOrder(split, 1, n);
        return new MCMResult(dp[1][n], optimalOrder);
    }

    private static String reconstructOptimalOrder(int[][] split, int i, int j) {
        if (i == j) {
            return "A" + i;
        }
        int k = split[i][j];
        String left = reconstructOptimalOrder(split, i, k);
        String right = reconstructOptimalOrder(split, k + 1, j);
        return "(" + left + right + ")";
    }
}
