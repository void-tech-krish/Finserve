package com.finserve.module4.service;

import com.finserve.module4.algorithms.*;

public class NetworkFlowAnalyticsService {

    public void maxTransactionFlowFordFulkerson(int[][] network, int source, int sink) {
        int maxFlow = FordFulkerson.maxFlow(network, source, sink);
        System.out.println("Ford-Fulkerson Maximum Transaction Flow: " + maxFlow);
    }

    public void maxTransactionFlowEdmondsKarp(int[][] network, int source, int sink) {
        int maxFlow = EdmondsKarp.maxFlow(network, source, sink);
        System.out.println("Edmonds-Karp Maximum Transaction Flow: " + maxFlow);
    }

    public void maxTransactionFlowDinic(int[][] network, int source, int sink) {
        int maxFlow = Dinic.maxFlow(network, source, sink);
        System.out.println("Dinic Maximum Transaction Flow: " + maxFlow);
    }

    public void analystToCaseMatching(boolean[][] availabilityMatrix) {
        BipartiteMatching.MatchingResult result = BipartiteMatching.maxMatching(availabilityMatrix);
        System.out.println("Maximum Analyst-Case Matching: " + result.maxMatching);
        for (int caseId = 0; caseId < result.assignedTo.length; caseId++) {
            if (result.assignedTo[caseId] != -1) {
                System.out.println("Analyst " + (result.assignedTo[caseId] + 1) + " -> Case " + (caseId + 1));
            }
        }
    }

    public void identifyCriticalChannels(int[][] network, int source, int sink) {
        MinCut.MinCutResult result = MinCut.findMinCut(network, source, sink);
        System.out.println("Minimum Cut Capacity: " + result.maxFlow);
        System.out.println("Critical Transaction Channels:");
        for (String edge : result.cutEdges) {
            System.out.println(edge);
        }
    }
}
