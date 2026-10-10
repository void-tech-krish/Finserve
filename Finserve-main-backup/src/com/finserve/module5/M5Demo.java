package com.finserve.module5;

import com.finserve.module5.algorithms.*;
import com.finserve.module5.service.NPCompletenessAnalyticsService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class M5Demo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        NPCompletenessAnalyticsService service = new NPCompletenessAnalyticsService();

        // 3-SAT Example
        List<int[]> clauses = new ArrayList<>();
        clauses.add(new int[]{1, 4, 5});
        clauses.add(new int[]{-3, 1, 5});
        clauses.add(new int[]{2, 4, -3});
        int numVariables = 5;

        // Graph Example
        boolean[][] graph = {
            {false, true, false, false, true},
            {true, false, true, false, true},
            {false, true, false, true, false},
            {false, false, true, false, true},
            {true, true, false, true, false}
        };

        while (true) {
            System.out.println("\n========================================");
            System.out.println(" FinServe - Module 5");
            System.out.println(" NP-Completeness & Approximation");
            System.out.println("========================================");
            System.out.println("1. Solve 3-SAT");
            System.out.println("2. 3-SAT -> CLIQUE");
            System.out.println("3. CLIQUE -> INDEPENDENT SET");
            System.out.println("4. INDEPENDENT SET -> VERTEX COVER");
            System.out.println("5. Vertex Cover 2-Approximation");
            System.out.println("6. Run Complete Reduction Demonstration");
            System.out.println("0. Exit");
            System.out.print("\nEnter choice: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    service.solveThreeSAT(numVariables, clauses);
                    break;
                case "2":
                    service.reduceThreeSATToClique(clauses);
                    break;
                case "3":
                    service.reduceCliqueToIndependentSet(graph);
                    break;
                case "4":
                    service.reduceIndependentSetToVertexCover(5, Arrays.asList(0, 2));
                    break;
                case "5":
                    service.computeVertexCoverApproximation(graph);
                    break;
                case "6":
                    System.out.println("\n--- COMPLETE REDUCTION DEMONSTRATION ---");
                    service.solveThreeSAT(numVariables, clauses);
                    ThreeSATToClique.ReductionResult res = ThreeSATToClique.reduce(clauses);
                    service.reduceThreeSATToClique(clauses);
                    service.reduceCliqueToIndependentSet(res.graph);
                    service.reduceIndependentSetToVertexCover(5, Arrays.asList(0, 2));
                    service.computeVertexCoverApproximation(graph);
                    break;
                case "0":
                    System.out.println("Exiting M5 Demo. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }
}
