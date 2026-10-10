package com.finserve.module2.tests;

import com.finserve.module2.algorithms.*;

import java.util.Arrays;
import java.util.List;

public class SuffixStructureTests {

    public static void main(String[] args) {
        System.out.println("Running Module 2 Tests...\n");
        testSuffixArray();
        testSAIS();
        testLCPKasai();
        testSuffixTree();
        testSuffixAutomaton();
        testCrossValidation();
        System.out.println("\nAll Module 2 tests completed successfully!");
    }

    private static void testSuffixArray() {
        System.out.println("--- Testing Suffix Array ---");
        // banana
        int[] sa1 = SuffixArray.buildSuffixArray("banana");
        assertArrayEquals(sa1, new int[]{5, 3, 1, 0, 4, 2}, "SuffixArray: banana");
        
        // single character
        int[] sa2 = SuffixArray.buildSuffixArray("a");
        assertArrayEquals(sa2, new int[]{0}, "SuffixArray: single character");
        
        // empty string
        int[] sa3 = SuffixArray.buildSuffixArray("");
        assertArrayEquals(sa3, new int[0], "SuffixArray: empty string");
        
        // search pattern found
        List<Integer> res1 = SuffixArray.search("banana", "ana", sa1);
        assertCondition(res1.contains(1) && res1.contains(3) && res1.size() == 2, "SuffixArray: search found");
        
        // search pattern not found
        List<Integer> res2 = SuffixArray.search("banana", "xyz", sa1);
        assertCondition(res2.isEmpty(), "SuffixArray: search not found");
        
        System.out.println("Suffix Array tests passed.");
    }

    private static void testSAIS() {
        System.out.println("--- Testing SA-IS ---");
        // banana
        int[] sa1 = SAIS.buildSuffixArray("banana");
        assertArrayEquals(sa1, new int[]{5, 3, 1, 0, 4, 2}, "SA-IS: banana");
        
        // mississippi
        int[] sa2 = SAIS.buildSuffixArray("mississippi");
        assertArrayEquals(sa2, new int[]{10, 7, 4, 1, 0, 9, 8, 6, 3, 5, 2}, "SA-IS: mississippi");
        
        System.out.println("SA-IS tests passed.");
    }

    private static void testLCPKasai() {
        System.out.println("--- Testing LCP/Kasai ---");
        String text = "banana";
        int[] sa = SuffixArray.buildSuffixArray(text);
        int[] lcp = LCPKasai.buildLCP(text, sa);
        
        // LCP of banana is typically represented as lengths of common prefixes between adjacent sorted suffixes
        // For sa: 5 (a), 3 (ana), 1 (anana), 0 (banana), 4 (na), 2 (nana)
        // LCP: [0, 1, 3, 0, 0, 2]
        assertArrayEquals(lcp, new int[]{0, 1, 3, 0, 0, 2}, "LCP/Kasai: banana");
        
        LCPKasai.RepeatedSubstringResult res = LCPKasai.findLongestRepeatedSubstring(text, sa, lcp);
        assertCondition(res.pattern.equals("ana") && res.length == 3, "LCP/Kasai: longest repeated substring");
        
        System.out.println("LCP/Kasai tests passed.");
    }

    private static void testSuffixTree() {
        System.out.println("--- Testing Suffix Tree ---");
        SuffixTree tree = new SuffixTree();
        tree.build("banana");
        
        assertCondition(tree.contains("ana"), "SuffixTree: substring exists");
        assertCondition(!tree.contains("xyz"), "SuffixTree: substring doesn't exist");
        assertCondition(tree.contains("ban"), "SuffixTree: multiple queries 1");
        assertCondition(tree.contains("nana"), "SuffixTree: multiple queries 2");
        
        System.out.println("Suffix Tree tests passed.");
    }

    private static void testSuffixAutomaton() {
        System.out.println("--- Testing Suffix Automaton ---");
        SuffixAutomaton sa = new SuffixAutomaton();
        sa.build("banana");
        
        assertCondition(sa.contains("ana"), "SuffixAutomaton: substring exists");
        assertCondition(!sa.contains("xyz"), "SuffixAutomaton: substring doesn't exist");
        
        long count = sa.countDistinctSubstrings();
        assertCondition(count == 15, "SuffixAutomaton: distinct substring count"); // b, a, n, ba, an, na, ban, ana, nan, bana, anan, nana, banan, anana, banana -> 15
        
        String lcs = sa.longestCommonSubstring("ananas");
        assertCondition(lcs.equals("anana"), "SuffixAutomaton: longest common substring");
        
        System.out.println("Suffix Automaton tests passed.");
    }

    private static void testCrossValidation() {
        System.out.println("--- Cross Validating SuffixArray vs SA-IS ---");
        String[] tests = {
            "banana",
            "mississippi",
            "abracadabra",
            "financialtransaction",
            "upiupipayment",
            "a",
            "aaaaa"
        };
        
        for (String text : tests) {
            int[] saBasic = SuffixArray.buildSuffixArray(text);
            int[] saIS = SAIS.buildSuffixArray(text);
            assertArrayEquals(saBasic, saIS, "CrossValidation failed for text: " + text);
        }
        System.out.println("Cross Validation passed.");
    }

    private static void assertArrayEquals(int[] actual, int[] expected, String message) {
        if (!Arrays.equals(actual, expected)) {
            throw new RuntimeException(message + " FAILED.\nExpected: " + Arrays.toString(expected) + "\nGot: " + Arrays.toString(actual));
        }
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new RuntimeException(message + " FAILED.");
        }
    }
}
