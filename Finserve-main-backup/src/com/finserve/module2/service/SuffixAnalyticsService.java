package com.finserve.module2.service;

import com.finserve.module2.algorithms.*;
import java.util.Arrays;
import java.util.List;

public class SuffixAnalyticsService {

    /**
     * 1. Transaction Description Indexing -> Suffix Array
     */
    public void indexTransactionDescription(String text) {
        System.out.println("\n--- SUFFIX ARRAY: Transaction Indexing ---");
        System.out.println("Transaction Text:\n" + text);
        int[] sa = SuffixArray.buildSuffixArray(text);
        System.out.println("Suffix Array (first 10 max):\n" + Arrays.toString(Arrays.copyOf(sa, Math.min(sa.length, 10))));
    }

    /**
     * 2. Large Financial Document Indexing -> SA-IS
     */
    public void indexFinancialDocument(String text) {
        System.out.println("\n--- SA-IS: Document Indexing ---");
        System.out.println("Document Text:\n" + text);
        int[] sa = SAIS.buildSuffixArray(text);
        System.out.println("Suffix Array (first 10 max):\n" + Arrays.toString(Arrays.copyOf(sa, Math.min(sa.length, 10))));
    }

    /**
     * 3. Repeated Transaction Pattern Detection -> LCP/Kasai
     */
    public void detectRepeatedPatterns(String text) {
        System.out.println("\n--- LCP / KASAI: Pattern Detection ---");
        System.out.println("Text:\n" + text);
        int[] sa = SuffixArray.buildSuffixArray(text);
        int[] lcp = LCPKasai.buildLCP(text, sa);
        LCPKasai.RepeatedSubstringResult result = LCPKasai.findLongestRepeatedSubstring(text, sa, lcp);
        
        System.out.println("Longest Repeated Pattern:\n" + result.pattern);
        System.out.println("Length:\n" + result.length);
    }

    /**
     * 4. Transaction Substring Query -> Suffix Tree
     */
    public void queryTransactionSubstring(String text, String query) {
        System.out.println("\n--- SUFFIX TREE: Substring Query ---");
        System.out.println("Text: " + text);
        System.out.println("Query: " + query);
        
        SuffixTree tree = new SuffixTree();
        tree.build(text);
        
        boolean found = tree.contains(query);
        System.out.println("Result:\n" + (found ? "Substring Found" : "Substring Not Found"));
    }

    /**
     * 5. Financial Text Substring Analysis -> Suffix Automaton
     */
    public void analyzeFinancialSubstring(String text, String query) {
        System.out.println("\n--- SUFFIX AUTOMATON: Analysis ---");
        System.out.println("Text: " + text);
        System.out.println("Query: " + query);
        
        SuffixAutomaton sa = new SuffixAutomaton();
        sa.build(text);
        
        boolean found = sa.contains(query);
        System.out.println("Result:\n" + (found ? "Substring Found" : "Substring Not Found"));
        System.out.println("Distinct Substrings count in text:\n" + sa.countDistinctSubstrings());
    }
}
