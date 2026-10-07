package com.finserve.module5.algorithms;

import java.util.List;

public class ThreeSATToClique {

    public static class ReductionResult {
        public boolean[][] graph;
        public int numVertices;
        public int targetCliqueSize;
        public int[] literalMapping;

        public ReductionResult(boolean[][] graph, int numVertices, int targetCliqueSize, int[] literalMapping) {
            this.graph = graph;
            this.numVertices = numVertices;
            this.targetCliqueSize = targetCliqueSize;
            this.literalMapping = literalMapping;
        }
    }

    /**
     * Reduces a 3-SAT formula to a CLIQUE graph.
     * @param clauses The 3-SAT clauses.
     * @return The ReductionResult containing the graph and mapping.
     */
    public static ReductionResult reduce(List<int[]> clauses) {
        if (clauses == null || clauses.isEmpty()) {
            return new ReductionResult(new boolean[0][0], 0, 0, new int[0]);
        }

        int m = clauses.size();
        int numVertices = 3 * m;
        boolean[][] graph = new boolean[numVertices][numVertices];
        int[] literalMapping = new int[numVertices];

        // Map vertices to literals
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < 3; j++) {
                literalMapping[i * 3 + j] = clauses.get(i)[j];
            }
        }

        // Add edges
        for (int i = 0; i < numVertices; i++) {
            for (int j = i + 1; j < numVertices; j++) {
                int clauseI = i / 3;
                int clauseJ = j / 3;

                // Rule 1: No edges within the same clause
                if (clauseI == clauseJ) {
                    continue;
                }

                int literalI = literalMapping[i];
                int literalJ = literalMapping[j];

                // Rule 2: No edges between contradictory literals (e.g. x and !x)
                if (literalI == -literalJ) {
                    continue;
                }

                // Otherwise, add edge
                graph[i][j] = true;
                graph[j][i] = true;
            }
        }

        return new ReductionResult(graph, numVertices, m, literalMapping);
    }
    
    /**
     * Solves CLIQUE using brute force for small graphs to verify the reduction.
     */
    public static boolean hasCliqueOfSize(boolean[][] graph, int k) {
        if (k == 0) return true;
        if (graph.length == 0) return false;
        
        int n = graph.length;
        int combinations = 1 << n;
        for (int mask = 0; mask < combinations; mask++) {
            if (Integer.bitCount(mask) == k) {
                if (isClique(graph, mask)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean isClique(boolean[][] graph, int mask) {
        int n = graph.length;
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                for (int j = i + 1; j < n; j++) {
                    if ((mask & (1 << j)) != 0) {
                        if (!graph[i][j]) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}
