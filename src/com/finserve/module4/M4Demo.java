package com.finserve.module4;

import com.finserve.module4.service.NetworkFlowAnalyticsService;
import java.util.Scanner;

public class M4Demo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        NetworkFlowAnalyticsService service = new NetworkFlowAnalyticsService();

        // Sample banking network
        int[][] network = {
            {0, 16, 13, 0, 0, 0},
            {0, 0, 10, 12, 0, 0},
            {0, 4, 0, 0, 14, 0},
            {0, 0, 9, 0, 0, 20},
            {0, 0, 0, 7, 0, 4},
            {0, 0, 0, 0, 0, 0}
        };

        boolean[][] matchingGraph = {
            {true, true, false},
            {true, false, false},
            {false, false, true}
        };

        while (true) {
            System.out.println("\n========================================");
            System.out.println(" FinServe - Module 4");
            System.out.println(" Network Flow Analytics");
            System.out.println("========================================");
            System.out.println("1. Ford-Fulkerson");
            System.out.println("2. Edmonds-Karp");
            System.out.println("3. Dinic's Algorithm");
            System.out.println("4. Bipartite Matching");
            System.out.println("5. Min-Cut");
            System.out.println("6. Run All Demonstrations");
            System.out.println("0. Exit");
            System.out.print("\nEnter choice: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    service.maxTransactionFlowFordFulkerson(network, 0, 5);
                    break;
                case "2":
                    service.maxTransactionFlowEdmondsKarp(network, 0, 5);
                    break;
                case "3":
                    service.maxTransactionFlowDinic(network, 0, 5);
                    break;
                case "4":
                    service.analystToCaseMatching(matchingGraph);
                    break;
                case "5":
                    service.identifyCriticalChannels(network, 0, 5);
                    break;
                case "6":
                    service.maxTransactionFlowFordFulkerson(network, 0, 5);
                    service.maxTransactionFlowEdmondsKarp(network, 0, 5);
                    service.maxTransactionFlowDinic(network, 0, 5);
                    System.out.println();
                    service.analystToCaseMatching(matchingGraph);
                    System.out.println();
                    service.identifyCriticalChannels(network, 0, 5);
                    break;
                case "0":
                    System.out.println("Exiting M4 Demo. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }
}
