package com.finserve.module5.service;

import com.finserve.module5.algorithms.*;
import java.util.List;
import java.util.ArrayList;

public class NPCompletenessAnalyticsService {

    public void solveThreeSAT(int numVariables, List<int[]> clauses) {
        System.out.println("3-SAT: Solving Financial Rules...");
        ThreeSAT.SATResult result = ThreeSAT.solve(numVariables, clauses);
        System.out.println("Satisfying Assignment Found = " + result.satisfiable);
        if (result.satisfiable) {
            System.out.print("Assignment: ");
            for (int i = 1; i <= numVariables; i++) {
                System.out.print("x" + i + "=" + result.assignment[i] + " ");
            }
            System.out.println();
        }
    }

    public void reduceThreeSATToClique(List<int[]> clauses) {
        System.out.println("\n3-SAT -> CLIQUE:");
        ThreeSATToClique.ReductionResult result = ThreeSATToClique.reduce(clauses);
        System.out.println("Vertices Created = " + result.numVertices);
        System.out.println("Target Clique Size = " + result.targetCliqueSize);
    }

    public void reduceCliqueToIndependentSet(boolean[][] graph) {
        System.out.println("\nCLIQUE -> INDEPENDENT SET:");
        boolean[][] complement = CliqueIndependentSet.getComplementGraph(graph);
        System.out.println("Complement Graph Created = " + (complement != null && complement.length > 0));
    }

    public void reduceIndependentSetToVertexCover(int numVertices, List<Integer> independentSet) {
        System.out.println("\nINDEPENDENT SET -> VERTEX COVER:");
        List<Integer> vertexCover = IndependentSetVertexCover.getVertexCoverFromIndependentSet(numVertices, independentSet);
        System.out.println("Independent Set Size = " + independentSet.size());
        System.out.println("Vertex Cover Size = " + vertexCover.size());
    }

    public void computeVertexCoverApproximation(boolean[][] graph) {
        System.out.println("\nVertex Cover Approximation:");
        List<Integer> approx = VertexCoverApproximation.approximateVertexCover(graph);
        int exact = VertexCoverApproximation.getExactMinimumVertexCoverSize(graph);
        System.out.println("Approximate Cover Size = " + approx.size());
        System.out.println("Exact Minimum Cover Size = " + exact);
        double ratio = (double) approx.size() / exact;
        System.out.printf("Approximation Ratio = %.2f\n", ratio);
    }
}
