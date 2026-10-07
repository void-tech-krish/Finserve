package com.finserve.module4.algorithms;

import java.util.Arrays;

public class BipartiteMatching {

    public static class MatchingResult {
        public int maxMatching;
        public int[] assignedTo; // index: right side node, value: left side node assigned to it

        public MatchingResult(int maxMatching, int[] assignedTo) {
            this.maxMatching = maxMatching;
            this.assignedTo = assignedTo;
        }
    }

    /**
     * @param adjMatrix bipartite graph where adjMatrix[u][v] is true if u (left) has edge to v (right)
     */
    public static MatchingResult maxMatching(boolean[][] adjMatrix) {
        if (adjMatrix == null || adjMatrix.length == 0 || adjMatrix[0].length == 0) {
            return new MatchingResult(0, new int[0]);
        }

        int leftNodes = adjMatrix.length;
        int rightNodes = adjMatrix[0].length;
        
        int[] assignedTo = new int[rightNodes];
        Arrays.fill(assignedTo, -1);
        
        int result = 0;
        for (int u = 0; u < leftNodes; u++) {
            boolean[] seen = new boolean[rightNodes];
            if (bpm(adjMatrix, u, seen, assignedTo)) {
                result++;
            }
        }
        
        return new MatchingResult(result, assignedTo);
    }

    private static boolean bpm(boolean[][] adjMatrix, int u, boolean[] seen, int[] assignedTo) {
        for (int v = 0; v < adjMatrix[0].length; v++) {
            if (adjMatrix[u][v] && !seen[v]) {
                seen[v] = true; 

                if (assignedTo[v] < 0 || bpm(adjMatrix, assignedTo[v], seen, assignedTo)) {
                    assignedTo[v] = u;
                    return true;
                }
            }
        }
        return false;
    }
}
