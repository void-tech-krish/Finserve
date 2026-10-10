package com.finserve.module1.service;

import com.finserve.module1.algorithms.KMP;
import com.finserve.module1.algorithms.ZFunction;
import com.finserve.module1.algorithms.RabinKarp;
import com.finserve.module1.algorithms.AhoCorasick;

import java.util.List;
import java.util.Map;

public class StringAnalyticsService {
    
    /**
     * 1. KMP - Transaction Code Search
     */
    public void searchTransactionCode(String text, String pattern) {
        System.out.println("\n--- KMP Transaction Search ---");
        System.out.println("Text: " + text);
        System.out.println("Pattern: " + pattern);
        
        List<Integer> matches = KMP.search(text, pattern);
        if (matches.isEmpty()) {
            System.out.println("Result: No match found.");
        } else {
            System.out.println("Result: Match found at index " + matches.get(0));
            if (matches.size() > 1) {
                System.out.println("All matches at: " + matches);
            }
        }
    }

    /**
     * 2. Z-Function - Analyze Description Pattern
     */
    public void analyzeDescriptionPattern(String text, String pattern) {
        System.out.println("\n--- Z-Function Description Pattern Analysis ---");
        System.out.println("Description: " + text);
        System.out.println("Repeated Pattern: " + pattern);
        
        List<Integer> matches = ZFunction.search(text, pattern);
        if (matches.isEmpty()) {
            System.out.println("Result: Pattern not found.");
        } else {
            System.out.println("Result: Pattern found at positions " + matches);
        }
    }

    /**
     * 3. Rabin-Karp - Search Financial Code
     */
    public void searchFinancialCode(String text, String pattern) {
        System.out.println("\n--- Rabin-Karp Financial Code Search ---");
        System.out.println("Transaction Text: " + text);
        System.out.println("Search Code: " + pattern);
        
        List<Integer> matches = RabinKarp.search(text, pattern);
        if (matches.isEmpty()) {
            System.out.println("Result: Code not found.");
        } else {
            System.out.println("Result: Code found at positions " + matches);
        }
    }

    /**
     * 4. Aho-Corasick - Detect Fraud Patterns
     */
    public void detectFraudPatterns(String transactionText, List<String> fraudKeywords) {
        System.out.println("\n--- Aho-Corasick Fraud Detection ---");
        System.out.println("Transaction: \"" + transactionText + "\"");
        
        AhoCorasick ac = new AhoCorasick();
        for (String kw : fraudKeywords) {
            ac.addPattern(kw);
        }
        ac.buildFailureLinks();
        
        Map<String, List<Integer>> matches = ac.search(transactionText);
        
        System.out.println("Detected patterns:");
        if (matches.isEmpty()) {
            System.out.println(" * No fraud keywords detected.");
        } else {
            for (String pattern : matches.keySet()) {
                System.out.println(" * " + pattern + " (at indices " + matches.get(pattern) + ")");
            }
        }
    }
}
