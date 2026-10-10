package com.finserve.module3.algorithms;

import java.util.Arrays;

public class BitmaskAssignment {

    public static class AssignmentResult {
        public int minCost;
        public int[] assignment; // index is operation, value is resource

        public AssignmentResult(int minCost, int[] assignment) {
            this.minCost = minCost;
            this.assignment = assignment;
        }
    }

    public static AssignmentResult minimumCost(int[][] cost) {
        if (cost == null || cost.length == 0 || cost[0].length == 0) {
            return new AssignmentResult(0, new int[0]);
        }

        int n = cost.length; // number of operations
        int m = cost[0].length; // number of resources
        
        if (n > m) {
            throw new IllegalArgumentException("Not enough resources to assign all operations.");
        }

        // dp[mask] stores the minimum cost to assign the first 'popcount(mask)' operations using the resources indicated by 'mask'
        int numStates = 1 << m;
        int[] dp = new int[numStates];
        int[] parent = new int[numStates];
        int[] assignedResource = new int[numStates];
        
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        Arrays.fill(parent, -1);
        dp[0] = 0;

        for (int mask = 0; mask < numStates; mask++) {
            int operationsAssigned = Integer.bitCount(mask);
            
            if (operationsAssigned >= n) continue; // All operations assigned for this state, or invalid

            for (int j = 0; j < m; j++) {
                if ((mask & (1 << j)) == 0) {
                    int newMask = mask | (1 << j);
                    int newCost = dp[mask] + cost[operationsAssigned][j];
                    if (newCost < dp[newMask]) {
                        dp[newMask] = newCost;
                        parent[newMask] = mask;
                        assignedResource[newMask] = j;
                    }
                }
            }
        }

        // Find the minimum cost among all masks that have exactly n bits set
        int minTotalCost = Integer.MAX_VALUE / 2;
        int bestMask = -1;
        for (int mask = 0; mask < numStates; mask++) {
            if (Integer.bitCount(mask) == n && dp[mask] < minTotalCost) {
                minTotalCost = dp[mask];
                bestMask = mask;
            }
        }

        if (bestMask == -1) {
            return new AssignmentResult(0, new int[0]); // Should not happen if n <= m
        }

        int[] assignment = new int[n];
        int currMask = bestMask;
        for (int op = n - 1; op >= 0; op--) {
            assignment[op] = assignedResource[currMask];
            currMask = parent[currMask];
        }

        return new AssignmentResult(minTotalCost, assignment);
    }
}
