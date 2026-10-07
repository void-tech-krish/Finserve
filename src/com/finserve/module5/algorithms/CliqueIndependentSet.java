package com.finserve.module5.algorithms;

import java.util.ArrayList;
import java.util.List;

public class CliqueIndependentSet {

    /**
     * Constructs the complement of an undirected graph.
     */
    public static boolean[][] getComplementGraph(boolean[][] graph) {
        if (graph == null) return new boolean[0][0];
        
        int n = graph.length;
        boolean[][] complement = new boolean[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    complement[i][j] = !graph[i][j];
                }
            }
        }
        
        return complement;
    }

    /**
     * Verifies if a given set of vertices forms a clique in the graph.
     */
    public static boolean isClique(boolean[][] graph, List<Integer> vertices) {
        for (int i = 0; i < vertices.size(); i++) {
            for (int j = i + 1; j < vertices.size(); j++) {
                int u = vertices.get(i);
                int v = vertices.get(j);
                if (!graph[u][v]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Verifies if a given set of vertices forms an independent set in the graph.
     */
    public static boolean isIndependentSet(boolean[][] graph, List<Integer> vertices) {
        for (int i = 0; i < vertices.size(); i++) {
            for (int j = i + 1; j < vertices.size(); j++) {
                int u = vertices.get(i);
                int v = vertices.get(j);
                if (graph[u][v]) {
                    return false;
                }
            }
        }
        return true;
    }
}
