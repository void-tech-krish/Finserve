package com.finserve.module4.algorithms;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class MinCut {

    public static class MinCutResult {
        public int maxFlow;
        public List<String> cutEdges;
        public List<Integer> sourceSide;
        public List<Integer> sinkSide;

        public MinCutResult(int maxFlow, List<String> cutEdges, List<Integer> sourceSide, List<Integer> sinkSide) {
            this.maxFlow = maxFlow;
            this.cutEdges = cutEdges;
            this.sourceSide = sourceSide;
            this.sinkSide = sinkSide;
        }
    }

    public static MinCutResult findMinCut(int[][] capacity, int source, int sink) {
        if (capacity == null || capacity.length == 0) {
            return new MinCutResult(0, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        int n = capacity.length;
        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(capacity[i], 0, residual[i], 0, n);
        }

        int[] parent = new int[n];
        int maxFlow = 0;

        // Run Edmonds-Karp to find max flow and residual graph
        while (bfs(residual, source, sink, parent)) {
            int pathFlow = Integer.MAX_VALUE;
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, residual[u][v]);
            }
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                residual[u][v] -= pathFlow;
                residual[v][u] += pathFlow;
            }
            maxFlow += pathFlow;
        }

        // Find reachable vertices from source in residual graph
        boolean[] reachable = new boolean[n];
        dfsReachable(residual, source, reachable);

        List<Integer> sourceSide = new ArrayList<>();
        List<Integer> sinkSide = new ArrayList<>();
        List<String> cutEdges = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (reachable[i]) {
                sourceSide.add(i);
                for (int j = 0; j < n; j++) {
                    // Edge exists in original graph and crosses the cut
                    if (!reachable[j] && capacity[i][j] > 0) {
                        cutEdges.add(i + " -> " + j);
                    }
                }
            } else {
                sinkSide.add(i);
            }
        }

        return new MinCutResult(maxFlow, cutEdges, sourceSide, sinkSide);
    }

    private static boolean bfs(int[][] residual, int source, int sink, int[] parent) {
        int n = residual.length;
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();

        queue.add(source);
        visited[source] = true;
        parent[source] = -1;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v = 0; v < n; v++) {
                if (!visited[v] && residual[u][v] > 0) {
                    queue.add(v);
                    parent[v] = u;
                    visited[v] = true;
                    if (v == sink) return true;
                }
            }
        }
        return false;
    }

    private static void dfsReachable(int[][] residual, int u, boolean[] visited) {
        visited[u] = true;
        for (int v = 0; v < residual.length; v++) {
            if (!visited[v] && residual[u][v] > 0) {
                dfsReachable(residual, v, visited);
            }
        }
    }
}
