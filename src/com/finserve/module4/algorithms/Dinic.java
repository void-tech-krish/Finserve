package com.finserve.module4.algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Dinic {

    static class Edge {
        int to, reverse, capacity, flow;

        Edge(int to, int reverse, int capacity) {
            this.to = to;
            this.reverse = reverse;
            this.capacity = capacity;
            this.flow = 0;
        }
    }

    public static int maxFlow(int[][] capacityMatrix, int source, int sink) {
        if (capacityMatrix == null || capacityMatrix.length == 0 || source == sink) {
            return 0;
        }

        int n = capacityMatrix.length;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                if (capacityMatrix[u][v] > 0) {
                    addEdge(adj, u, v, capacityMatrix[u][v]);
                }
            }
        }

        int maxFlow = 0;
        int[] level = new int[n];
        int[] ptr = new int[n];

        while (bfs(adj, source, sink, level)) {
            Arrays.fill(ptr, 0);
            while (true) {
                int pushed = dfs(adj, source, sink, Integer.MAX_VALUE, level, ptr);
                if (pushed == 0) break;
                maxFlow += pushed;
            }
        }

        return maxFlow;
    }

    private static void addEdge(List<List<Edge>> adj, int u, int v, int capacity) {
        Edge a = new Edge(v, adj.get(v).size(), capacity);
        Edge b = new Edge(u, adj.get(u).size(), 0);
        adj.get(u).add(a);
        adj.get(v).add(b);
    }

    private static boolean bfs(List<List<Edge>> adj, int source, int sink, int[] level) {
        Arrays.fill(level, -1);
        level[source] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.add(source);

        while (!q.isEmpty()) {
            int u = q.poll();
            for (Edge edge : adj.get(u)) {
                if (edge.capacity - edge.flow > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[u] + 1;
                    q.add(edge.to);
                }
            }
        }
        return level[sink] != -1;
    }

    private static int dfs(List<List<Edge>> adj, int u, int sink, int pushed, int[] level, int[] ptr) {
        if (pushed == 0) return 0;
        if (u == sink) return pushed;

        for (int cid = ptr[u]; cid < adj.get(u).size(); ++cid) {
            ptr[u] = cid;
            Edge edge = adj.get(u).get(cid);
            int tr = edge.to;

            if (level[u] + 1 != level[tr] || edge.capacity - edge.flow == 0) continue;

            int push = dfs(adj, tr, sink, Math.min(pushed, edge.capacity - edge.flow), level, ptr);
            if (push == 0) continue;

            edge.flow += push;
            adj.get(tr).get(edge.reverse).flow -= push;
            return push;
        }
        return 0;
    }
}
