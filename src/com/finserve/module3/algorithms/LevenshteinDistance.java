package com.finserve.module3.algorithms;

import java.util.List;

public class LevenshteinDistance {

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
                if (source.charAt(i - 1) == target.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int insert = dp[i][j - 1] + 1;
                    int delete = dp[i - 1][j] + 1;
                    int substitute = dp[i - 1][j - 1] + 1;
                    dp[i][j] = Math.min(insert, Math.min(delete, substitute));
                }
            }
        }

        return dp[m][n];
    }

    public static String getClosestDescription(String input, List<String> possibleDescriptions) {
        if (possibleDescriptions == null || possibleDescriptions.isEmpty()) {
            return null;
        }

        String closest = null;
        int minDistance = Integer.MAX_VALUE;

        for (String desc : possibleDescriptions) {
            int dist = calculate(input, desc);
            if (dist < minDistance) {
                minDistance = dist;
                closest = desc;
            }
        }

        return closest;
    }
}
