package com.finserve.module3;

import com.finserve.module3.service.DPAnalyticsService;

import java.util.Arrays;
import java.util.Scanner;

public class DPDemo {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        DPAnalyticsService service = new DPAnalyticsService();

        while (true) {
            System.out.println("\n========================================");
            System.out.println(" FINserve ADVANCED DYNAMIC PROGRAMMING");
            System.out.println("========================================");
            System.out.println("1. Levenshtein Distance");
            System.out.println("2. Damerau-Levenshtein Distance");
            System.out.println("3. Weighted Edit Distance");
            System.out.println("4. Bitmask DP Assignment");
            System.out.println("5. Matrix-Chain Multiplication");
            System.out.println("6. Exit");
            System.out.println("========================================");
            System.out.print("Select an option: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    System.out.print("Enter source description (e.g., paymant): ");
                    String lSource = scanner.nextLine();
                    service.correctTransactionDescription(lSource, Arrays.asList("payment", "withdrawal", "transfer", "deposit"));
                    break;
                case "2":
                    System.out.print("Enter source string (e.g., paiment): ");
                    String dSource = scanner.nextLine();
                    System.out.print("Enter target string (e.g., payment): ");
                    String dTarget = scanner.nextLine();
                    service.handleTypingTransposition(dSource, dTarget);
                    break;
                case "3":
                    System.out.print("Enter source string: ");
                    String wSource = scanner.nextLine();
                    System.out.print("Enter target string: ");
                    String wTarget = scanner.nextLine();
                    service.calculateCorrectionCost(wSource, wTarget, 1, 1, 2);
                    break;
                case "4":
                    System.out.println("Using predefined 4x4 FinServe cost matrix...");
                    int[][] costMatrix = {
                        {9, 2, 7, 8}, // Fraud Review
                        {6, 4, 3, 7}, // Transaction Verification
                        {5, 8, 1, 8}, // Account Validation
                        {7, 6, 9, 4}  // Payment Investigation
                    };
                    service.assignAnalystsOptimally(costMatrix);
                    break;
                case "5":
                    System.out.println("Using predefined matrices: A1(10x20), A2(20x30), A3(30x40), A4(40x30)");
                    int[] dimensions = {10, 20, 30, 40, 30};
                    service.optimizeAnalyticalOperations(dimensions);
                    break;
                case "6":
                    System.out.println("Exiting DP Demo. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
}
