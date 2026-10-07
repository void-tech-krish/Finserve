package com.finserve.module5.algorithms;

import java.util.ArrayList;
import java.util.List;

public class VertexCoverApproximation {

    /**
     * Computes a 2-approximation for Vertex Cover.
     */
    public static List<Integer> approximateVertexCover(boolean[][] graph) {
        int n = graph.length;
        List<Integer> cover = new ArrayList<>();
        boolean[] coveredEdges = new boolean[n * n];
        boolean[] inCover = new boolean[n];
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (graph[i][j]) {
                    // Check if edge is already covered
                    if (!inCover[i] && !inCover[j]) {
                        // Uncovered edge (i, j) found. Add both to cover.
                        inCover[i] = true;
                        inCover[j] = true;
                        cover.add(i);
                        cover.add(j);
                    }
                }
            }
        }
        return cover;
    }

    /**
     * Exact brute-force solver for small educational graphs to verify the approximation ratio.
     */
    public static int getExactMinimumVertexCoverSize(boolean[][] graph) {
        int n = graph.length;
        int minSize = n;
        int combinations = 1 << n;
        
        for (int mask = 0; mask < combinations; mask++) {
            List<Integer> candidate = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    candidate.add(i);
                }
            }
            if (IndependentSetVertexCover.isVertexCover(graph, candidate)) {
                minSize = Math.min(minSize, candidate.size());
            }
        }
        return minSize;
    }
}
