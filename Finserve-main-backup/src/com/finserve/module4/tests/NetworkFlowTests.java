package com.finserve.module4.tests;

import com.finserve.module4.algorithms.*;

public class NetworkFlowTests {

    public static void main(String[] args) {
        System.out.println("Running Module 4 Tests...\n");
        testFordFulkerson();
        testEdmondsKarp();
        testDinic();
        testBipartiteMatching();
        testMinCut();
        testCrossValidation();
        System.out.println("\nAll Module 4 tests completed successfully!");
    }

    private static void testFordFulkerson() {
        System.out.println("--- Testing Ford-Fulkerson ---");
        int[][] graph1 = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };
        assertCondition(FordFulkerson.maxFlow(graph1, 0, 5) == 23, "Ford-Fulkerson: Standard textbook graph");

        int[][] graph2 = {{0, 10}, {0, 0}};
        assertCondition(FordFulkerson.maxFlow(graph2, 0, 1) == 10, "Ford-Fulkerson: Single path");

        int[][] graph3 = {{0, 0}, {0, 0}};
        assertCondition(FordFulkerson.maxFlow(graph3, 0, 1) == 0, "Ford-Fulkerson: Disconnected graph");

        int[][] graph4 = {{0, 0, 10}, {0, 0, 0}, {0, 0, 0}};
        assertCondition(FordFulkerson.maxFlow(graph4, 0, 2) == 10, "Ford-Fulkerson: Zero-capacity edge properly handled");

        int[][] graph5 = {
            {0, 10, 0},
            {0, 0, 10},
            {0, 0, 0}
        };
        assertCondition(FordFulkerson.maxFlow(graph5, 0, 2) == 10, "Ford-Fulkerson: Multiple paths");
        System.out.println("Ford-Fulkerson tests passed.");
    }

    private static void testEdmondsKarp() {
        System.out.println("--- Testing Edmonds-Karp ---");
        int[][] graph1 = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };
        assertCondition(EdmondsKarp.maxFlow(graph1, 0, 5) == 23, "Edmonds-Karp: Standard textbook graph");
        assertCondition(EdmondsKarp.maxFlow(graph1, 0, 5) == FordFulkerson.maxFlow(graph1, 0, 5), "Edmonds-Karp: Compare with Ford-Fulkerson");
        System.out.println("Edmonds-Karp tests passed.");
    }

    private static void testDinic() {
        System.out.println("--- Testing Dinic's Algorithm ---");
        int[][] graph1 = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };
        assertCondition(Dinic.maxFlow(graph1, 0, 5) == 23, "Dinic: Standard textbook graph");
        System.out.println("Dinic's Algorithm tests passed.");
    }

    private static void testBipartiteMatching() {
        System.out.println("--- Testing Bipartite Matching ---");
        boolean[][] bp1 = {
            {true, true},
            {true, true}
        };
        assertCondition(BipartiteMatching.maxMatching(bp1).maxMatching == 2, "BipartiteMatching: 2x2 complete matching");

        boolean[][] bp2 = {
            {true, true, false},
            {true, false, false},
            {false, false, true}
        };
        assertCondition(BipartiteMatching.maxMatching(bp2).maxMatching == 3, "BipartiteMatching: 3x3 matching");

        boolean[][] bp3 = {
            {true, true},
            {true, false},
            {false, false}
        };
        assertCondition(BipartiteMatching.maxMatching(bp3).maxMatching == 2, "BipartiteMatching: Analyst with no cases");
        
        boolean[][] bp4 = new boolean[0][0];
        assertCondition(BipartiteMatching.maxMatching(bp4).maxMatching == 0, "BipartiteMatching: Empty graph");
        System.out.println("Bipartite Matching tests passed.");
    }

    private static void testMinCut() {
        System.out.println("--- Testing Min-Cut ---");
        int[][] graph1 = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };
        MinCut.MinCutResult result = MinCut.findMinCut(graph1, 0, 5);
        assertCondition(result.maxFlow == 23, "MinCut: Max-flow value matches cut capacity");
        assertCondition(!result.cutEdges.isEmpty(), "MinCut: Identifies cut edges");
        System.out.println("Min-Cut tests passed.");
    }

    private static void testCrossValidation() {
        System.out.println("--- Cross-Validation ---");
        int[][] graph1 = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };
        
        int ff = FordFulkerson.maxFlow(graph1, 0, 5);
        int ek = EdmondsKarp.maxFlow(graph1, 0, 5);
        int d = Dinic.maxFlow(graph1, 0, 5);
        
        assertCondition(ff == ek && ek == d, "Cross-Validation: Ford-Fulkerson == Edmonds-Karp == Dinic");
        
        MinCut.MinCutResult mc = MinCut.findMinCut(graph1, 0, 5);
        assertCondition(ff == mc.maxFlow, "Cross-Validation: Max Flow == Minimum Cut Capacity");
        System.out.println("Cross-Validation tests passed.");
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new RuntimeException(message + " FAILED.");
        }
    }
}
