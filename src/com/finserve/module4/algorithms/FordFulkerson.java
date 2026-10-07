package com.finserve.module4.algorithms;

import java.util.Arrays;

public class FordFulkerson {

    public static int maxFlow(int[][] capacity, int source, int sink) {
        if (capacity == null || capacity.length == 0 || source == sink) {
            return 0;
        }

        int n = capacity.length;
        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(capacity[i], 0, residual[i], 0, n);
        }

        int[] parent = new int[n];
        int maxFlow = 0;

        while (dfs(residual, source, sink, parent, new boolean[n])) {
            int pathFlow = Integer.MAX_VALUE;
            
            // Find bottleneck capacity
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, residual[u][v]);
            }

            // Update residual capacities
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                residual[u][v] -= pathFlow;
                residual[v][u] += pathFlow;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    private static boolean dfs(int[][] residual, int u, int sink, int[] parent, boolean[] visited) {
        visited[u] = true;
        if (u == sink) return true;

        for (int v = 0; v < residual.length; v++) {
            if (!visited[v] && residual[u][v] > 0) {
                parent[v] = u;
                if (dfs(residual, v, sink, parent, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
}
