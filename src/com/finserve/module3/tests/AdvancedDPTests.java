package com.finserve.module3.tests;

import com.finserve.module3.algorithms.*;

public class AdvancedDPTests {

    public static void main(String[] args) {
        System.out.println("Running Module 3 Tests...\n");
        testLevenshtein();
        testDamerauLevenshtein();
        testWeightedEditDistance();
        testBitmaskDP();
        testMatrixChainMultiplication();
        System.out.println("\nAll Module 3 tests completed successfully!");
    }

    private static void testLevenshtein() {
        System.out.println("--- Testing Levenshtein Distance ---");
        assertCondition(LevenshteinDistance.calculate("payment", "payment") == 0, "Levenshtein: Same strings");
        assertCondition(LevenshteinDistance.calculate("", "") == 0, "Levenshtein: Empty strings");
        assertCondition(LevenshteinDistance.calculate("pay", "paym") == 1, "Levenshtein: One insertion");
        assertCondition(LevenshteinDistance.calculate("paym", "pay") == 1, "Levenshtein: One deletion");
        assertCondition(LevenshteinDistance.calculate("paymant", "payment") == 1, "Levenshtein: One substitution");
        assertCondition(LevenshteinDistance.calculate("kitten", "sitting") == 3, "Levenshtein: Multiple edits");
        System.out.println("Levenshtein tests passed.");
    }

    private static void testDamerauLevenshtein() {
        System.out.println("--- Testing Damerau-Levenshtein Distance ---");
        assertCondition(DamerauLevenshtein.calculate("payment", "payment") == 0, "Damerau-Levenshtein: Same strings");
        assertCondition(DamerauLevenshtein.calculate("", "") == 0, "Damerau-Levenshtein: Empty strings");
        assertCondition(DamerauLevenshtein.calculate("paymant", "payment") == 1, "Damerau-Levenshtein: Substitution");
        assertCondition(DamerauLevenshtein.calculate("pay", "paym") == 1, "Damerau-Levenshtein: Insertion");
        assertCondition(DamerauLevenshtein.calculate("paym", "pay") == 1, "Damerau-Levenshtein: Deletion");
        assertCondition(DamerauLevenshtein.calculate("ab", "ba") == 1, "Damerau-Levenshtein: Adjacent transposition");
        assertCondition(DamerauLevenshtein.calculate("recieve", "receive") == 1, "Damerau-Levenshtein: recieve -> receive");
        System.out.println("Damerau-Levenshtein tests passed.");
    }

    private static void testWeightedEditDistance() {
        System.out.println("--- Testing Weighted Edit Distance ---");
        assertCondition(WeightedEditDistance.calculate("payment", "payment", 1, 1, 2) == 0, "WeightedEditDistance: Same strings");
        assertCondition(WeightedEditDistance.calculate("", "", 1, 1, 2) == 0, "WeightedEditDistance: Empty strings");
        assertCondition(WeightedEditDistance.calculate("pay", "paym", 5, 2, 3) == 5, "WeightedEditDistance: Insertion cost");
        assertCondition(WeightedEditDistance.calculate("paym", "pay", 5, 2, 3) == 2, "WeightedEditDistance: Deletion cost");
        assertCondition(WeightedEditDistance.calculate("paymant", "payment", 1, 1, 10) == 2, "WeightedEditDistance: Substitution cost fallback to insert+delete");
        assertCondition(WeightedEditDistance.calculate("paymant", "payment", 5, 5, 2) == 2, "WeightedEditDistance: Substitution cost taken");
        System.out.println("Weighted Edit Distance tests passed.");
    }

    private static void testBitmaskDP() {
        System.out.println("--- Testing Bitmask DP ---");
        int[][] cost2x2 = {{3, 1}, {2, 4}};
        assertCondition(BitmaskAssignment.minimumCost(cost2x2).minCost == 3, "BitmaskDP: 2x2 matrix");
        
        int[][] cost3x3 = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        assertCondition(BitmaskAssignment.minimumCost(cost3x3).minCost == 15, "BitmaskDP: 3x3 matrix");
        
        int[][] cost4x4 = {
            {9, 2, 7, 8},
            {6, 4, 3, 7},
            {5, 8, 1, 8},
            {7, 6, 9, 4}
        };
        BitmaskAssignment.AssignmentResult res = BitmaskAssignment.minimumCost(cost4x4);
        assertCondition(res.minCost == 13, "BitmaskDP: 4x4 FinServe assignment");
        System.out.println("Bitmask DP tests passed.");
    }

    private static void testMatrixChainMultiplication() {
        System.out.println("--- Testing Matrix-Chain Multiplication ---");
        assertCondition(MatrixChainMultiplication.minimumMultiplicationCost(new int[]{10, 20}).minCost == 0, "MatrixChain: Single matrix");
        assertCondition(MatrixChainMultiplication.minimumMultiplicationCost(new int[]{10, 20, 30}).minCost == 6000, "MatrixChain: Two matrices");
        assertCondition(MatrixChainMultiplication.minimumMultiplicationCost(new int[]{10, 20, 30, 40, 30}).minCost == 30000, "MatrixChain: 4-matrix example");
        
        MatrixChainMultiplication.MCMResult res = MatrixChainMultiplication.minimumMultiplicationCost(new int[]{10, 20, 30, 40, 30});
        assertCondition(res.optimalOrder.equals("((A1(A2A3))A4)") || res.optimalOrder.equals("(((A1A2)A3)A4)") || res.optimalOrder.equals("((A1A2)(A3A4))"), "MatrixChain: Valid parenthesis format");
        
        System.out.println("Matrix-Chain Multiplication tests passed.");
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new RuntimeException(message + " FAILED.");
        }
    }
}
