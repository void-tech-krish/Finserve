package com.finserve.module3.algorithms;

public class DamerauLevenshtein {

    public static int calculate(String source, String target) {
        if (source == null) source = "";
        if (target == null) target = "";

        int m = source.length();
        int n = target.length();

        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int cost = (source.charAt(i - 1) == target.charAt(j - 1)) ? 0 : 1;

                int insert = dp[i][j - 1] + 1;
                int delete = dp[i - 1][j] + 1;
                int substitute = dp[i - 1][j - 1] + cost;

                dp[i][j] = Math.min(insert, Math.min(delete, substitute));

                // Adjacent transposition
                if (i > 1 && j > 1 
                        && source.charAt(i - 1) == target.charAt(j - 2) 
                        && source.charAt(i - 2) == target.charAt(j - 1)) {
                    dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
                }
            }
        }

        return dp[m][n];
    }
}
