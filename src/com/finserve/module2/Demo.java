package com.finserve.module2;

import com.finserve.module2.service.SuffixAnalyticsService;
import java.util.Scanner;

public class Demo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        SuffixAnalyticsService service = new SuffixAnalyticsService();
        
        while (true) {
            System.out.println("\n========================================");
            System.out.println("       FINserve SUFFIX STRUCTURES");
            System.out.println("========================================");
            System.out.println("1. Build Suffix Array");
            System.out.println("2. Build SA-IS Suffix Array");
            System.out.println("3. Analyze LCP using Kasai");
            System.out.println("4. Search using Suffix Tree");
            System.out.println("5. Search using Suffix Automaton");
            System.out.println("6. Exit");
            System.out.print("Select an option: ");
            
            String choice = scanner.nextLine();
            
            switch (choice) {
                case "1":
                    System.out.print("Enter transaction text: ");
                    String text1 = scanner.nextLine();
                    service.indexTransactionDescription(text1);
                    break;
                case "2":
                    System.out.print("Enter document text: ");
                    String text2 = scanner.nextLine();
                    service.indexFinancialDocument(text2);
                    break;
                case "3":
                    System.out.print("Enter text to find repeated pattern: ");
                    String text3 = scanner.nextLine();
                    service.detectRepeatedPatterns(text3);
                    break;
                case "4":
                    System.out.print("Enter transaction text: ");
                    String text4 = scanner.nextLine();
                    System.out.print("Enter search query: ");
                    String query4 = scanner.nextLine();
                    service.queryTransactionSubstring(text4, query4);
                    break;
                case "5":
                    System.out.print("Enter financial text: ");
                    String text5 = scanner.nextLine();
                    System.out.print("Enter search query: ");
                    String query5 = scanner.nextLine();
                    service.analyzeFinancialSubstring(text5, query5);
                    break;
                case "6":
                    System.out.println("Exiting Suffix Demo. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
}
