package com.finserve.module1;

import com.finserve.module1.service.StringAnalyticsService;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class Demo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StringAnalyticsService service = new StringAnalyticsService();
        
        // Sample predefined fraud keywords
        List<String> fraudKeywords = Arrays.asList(
            "fraud", "scam", "stolen", "phishing", "unauthorized", "suspicious", "blocked"
        );

        while (true) {
            System.out.println("\n=================================");
            System.out.println("   FINserve STRING ANALYTICS");
            System.out.println("=================================");
            System.out.println("1. Search Transaction Code - KMP");
            System.out.println("2. Analyze Description Pattern - Z-Function");
            System.out.println("3. Search Financial Code - Rabin-Karp");
            System.out.println("4. Detect Fraud Patterns - Aho-Corasick");
            System.out.println("5. Exit");
            System.out.print("Select an option: ");
            
            String choice = scanner.nextLine();
            
            switch (choice) {
                case "1":
                    System.out.print("Enter full transaction text: ");
                    String kmpText = scanner.nextLine();
                    System.out.print("Enter transaction code to search: ");
                    String kmpPattern = scanner.nextLine();
                    service.searchTransactionCode(kmpText, kmpPattern);
                    break;
                case "2":
                    System.out.print("Enter description text: ");
                    String zText = scanner.nextLine();
                    System.out.print("Enter prefix/pattern to analyze: ");
                    String zPattern = scanner.nextLine();
                    service.analyzeDescriptionPattern(zText, zPattern);
                    break;
                case "3":
                    System.out.print("Enter full transaction text: ");
                    String rkText = scanner.nextLine();
                    System.out.print("Enter financial code to search: ");
                    String rkPattern = scanner.nextLine();
                    service.searchFinancialCode(rkText, rkPattern);
                    break;
                case "4":
                    System.out.print("Enter transaction description for fraud check: ");
                    String acText = scanner.nextLine();
                    service.detectFraudPatterns(acText, fraudKeywords);
                    break;
                case "5":
                    System.out.println("Exiting FinServe String Analytics. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
}
