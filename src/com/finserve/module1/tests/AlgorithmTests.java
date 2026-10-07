package com.finserve.module1.tests;

import com.finserve.module1.algorithms.KMP;
import com.finserve.module1.algorithms.ZFunction;
import com.finserve.module1.algorithms.RabinKarp;
import com.finserve.module1.algorithms.AhoCorasick;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class AlgorithmTests {

    public static void main(String[] args) {
        System.out.println("Running Module 1 Tests...\n");
        testKMP();
        testZFunction();
        testRabinKarp();
        testAhoCorasick();
        System.out.println("\nAll tests completed successfully!");
    }

    private static void testKMP() {
        System.out.println("--- Testing KMP ---");
        // 1. Pattern found
        assertListEquals(KMP.search("Payment TXN20261001 completed", "TXN20261001"), Arrays.asList(8), "KMP: Pattern found");
        // 2. Pattern not found
        assertListEquals(KMP.search("Payment TXN20261001 completed", "TXN999"), Arrays.asList(), "KMP: Pattern not found");
        // 3. Multiple occurrences
        assertListEquals(KMP.search("ABC ABC ABC", "ABC"), Arrays.asList(0, 4, 8), "KMP: Multiple occurrences");
        // 4. Empty pattern
        assertListEquals(KMP.search("Test", ""), Arrays.asList(), "KMP: Empty pattern");
        System.out.println("KMP tests passed.");
    }

    private static void testZFunction() {
        System.out.println("--- Testing Z-Function ---");
        // 1. Pattern found
        assertListEquals(ZFunction.search("Payment failed due to network error", "Payment failed"), Arrays.asList(0), "Z-Function: Pattern found");
        // 2. Pattern not found
        assertListEquals(ZFunction.search("Payment failed", "Success"), Arrays.asList(), "Z-Function: Pattern not found");
        // 3. Repeated pattern
        assertListEquals(ZFunction.search("Payment failed, Payment failed again", "Payment failed"), Arrays.asList(0, 16), "Z-Function: Repeated pattern");
        // 4. Empty input
        assertListEquals(ZFunction.search("", "pattern"), Arrays.asList(), "Z-Function: Empty input");
        System.out.println("Z-Function tests passed.");
    }

    private static void testRabinKarp() {
        System.out.println("--- Testing Rabin-Karp ---");
        // 1. Pattern found
        assertListEquals(RabinKarp.search("UPI payment reference UPI987654321 completed", "UPI987654321"), Arrays.asList(22), "Rabin-Karp: Pattern found");
        // 2. Pattern not found
        assertListEquals(RabinKarp.search("UPI payment reference UPI987654321 completed", "INVALID"), Arrays.asList(), "Rabin-Karp: Pattern not found");
        // 3. Multiple occurrences
        assertListEquals(RabinKarp.search("UPI123 and UPI123", "UPI123"), Arrays.asList(0, 11), "Rabin-Karp: Multiple occurrences");
        // 4. Hash collision safety (basic check, since we handle exact char matches)
        assertListEquals(RabinKarp.search("abcd bcda", "bcda"), Arrays.asList(5), "Rabin-Karp: Hash safety check");
        System.out.println("Rabin-Karp tests passed.");
    }

    private static void testAhoCorasick() {
        System.out.println("--- Testing Aho-Corasick ---");
        AhoCorasick ac = new AhoCorasick();
        ac.addPattern("fraud");
        ac.addPattern("scam");
        ac.addPattern("unauthorized");
        ac.buildFailureLinks();

        // 1. One pattern matched
        Map<String, List<Integer>> res1 = ac.search("This is a scam");
        assertCondition(res1.containsKey("scam") && res1.get("scam").contains(10), "Aho-Corasick: One pattern matched");

        // 2. Multiple patterns matched
        Map<String, List<Integer>> res2 = ac.search("unauthorized fraud detected");
        assertCondition(res2.containsKey("unauthorized") && res2.containsKey("fraud"), "Aho-Corasick: Multiple patterns matched");

        // 3. No fraud pattern
        Map<String, List<Integer>> res3 = ac.search("regular transaction");
        assertCondition(res3.isEmpty(), "Aho-Corasick: No fraud pattern");

        // 4. Overlapping patterns
        AhoCorasick acOverlap = new AhoCorasick();
        acOverlap.addPattern("he");
        acOverlap.addPattern("she");
        acOverlap.addPattern("his");
        acOverlap.addPattern("hers");
        acOverlap.buildFailureLinks();
        Map<String, List<Integer>> res4 = acOverlap.search("ushers");
        assertCondition(res4.containsKey("she") && res4.containsKey("he") && res4.containsKey("hers"), "Aho-Corasick: Overlapping patterns");
        
        System.out.println("Aho-Corasick tests passed.");
    }

    private static void assertListEquals(List<Integer> actual, List<Integer> expected, String message) {
        if (!actual.equals(expected)) {
            throw new RuntimeException(message + " FAILED. Expected: " + expected + ", Got: " + actual);
        }
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new RuntimeException(message + " FAILED.");
        }
    }
}
