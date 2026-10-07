package com.finserve.module5.algorithms;

import java.util.ArrayList;
import java.util.List;

public class IndependentSetVertexCover {

    /**
     * Constructs a Vertex Cover from an Independent Set by taking its complement in V.
     */
    public static List<Integer> getVertexCoverFromIndependentSet(int numVertices, List<Integer> independentSet) {
        List<Integer> vertexCover = new ArrayList<>();
        boolean[] inIS = new boolean[numVertices];
        
        for (int v : independentSet) {
            inIS[v] = true;
        }

        for (int i = 0; i < numVertices; i++) {
            if (!inIS[i]) {
                vertexCover.add(i);
            }
        }
        return vertexCover;
    }

    /**
     * Verifies if a given set of vertices is a valid Vertex Cover.
     */
    public static boolean isVertexCover(boolean[][] graph, List<Integer> cover) {
        int n = graph.length;
        boolean[] inCover = new boolean[n];
        for (int v : cover) {
            inCover[v] = true;
        }

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (graph[i][j]) {
                    if (!inCover[i] && !inCover[j]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
