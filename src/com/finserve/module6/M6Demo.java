package com.finserve.module6;

import com.finserve.module6.service.RandomizedParallelAnalyticsService;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class M6Demo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        RandomizedParallelAnalyticsService service = new RandomizedParallelAnalyticsService();

        long[] amounts = {4500, 1200, 9800, 350, 7600, 1200};
        List<String> stream = Arrays.asList("TXN1", "TXN2", "TXN3", "TXN4", "TXN5", "TXN6", "TXN7", "TXN8", "TXN9", "TXN10");
        long primeTarget = 1000000007L;
        long[] scanAmounts = {1000, 2500, 500, 3000};

        while (true) {
            System.out.println("\n========================================");
            System.out.println(" FinServe - Module 6 Demo");
            System.out.println(" Randomized & Parallel Algorithms");
            System.out.println("========================================");
            System.out.println("1. Randomized QuickSort");
            System.out.println("2. Miller-Rabin Primality Test");
            System.out.println("3. Reservoir Sampling");
            System.out.println("4. Blelloch Scan");
            System.out.println("5. Parallel Reduce");
            System.out.println("6. Brent's Theorem");
            System.out.println("7. Run All");
            System.out.println("0. Exit");
            System.out.print("\nEnter choice: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    service.rankTransactions(amounts.clone());
                    break;
                case "2":
                    service.testLargeNumber(primeTarget);
                    break;
                case "3":
                    service.sampleTransactionStream(stream, 3);
                    break;
                case "4":
                    service.calculateCumulativeTransactions(scanAmounts);
                    break;
                case "5":
                    service.aggregateTransactions(amounts, 4);
                    break;
                case "6":
                    service.analyzeParallelProcessing(1000, 100, 8);
                    break;
                case "7":
                    service.rankTransactions(amounts.clone());
                    service.testLargeNumber(primeTarget);
                    service.sampleTransactionStream(stream, 3);
                    service.calculateCumulativeTransactions(scanAmounts);
                    service.aggregateTransactions(amounts, 4);
                    service.analyzeParallelProcessing(1000, 100, 8);
                    break;
                case "0":
                    System.out.println("Exiting M6 Demo. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid choice.");
            }
        }
    }
}
