package com.finserve.module3.algorithms;

public class WeightedEditDistance {

    public static int calculate(String source, String target, int insertionCost, int deletionCost, int substitutionCost) {
        if (source == null) source = "";
        if (target == null) target = "";

        int m = source.length();
        int n = target.length();

        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) {
            dp[i][0] = i * deletionCost;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j * insertionCost;
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (source.charAt(i - 1) == target.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int insert = dp[i][j - 1] + insertionCost;
                    int delete = dp[i - 1][j] + deletionCost;
                    int substitute = dp[i - 1][j - 1] + substitutionCost;
                    dp[i][j] = Math.min(insert, Math.min(delete, substitute));
                }
            }
        }

        return dp[m][n];
    }
}
