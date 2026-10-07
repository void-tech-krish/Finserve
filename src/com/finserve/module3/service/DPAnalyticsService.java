package com.finserve.module3.service;

import com.finserve.module3.algorithms.*;

import java.util.Arrays;
import java.util.List;

public class DPAnalyticsService {

    /**
     * 1. Correct transaction description -> Levenshtein
     */
    public void correctTransactionDescription(String input, List<String> dictionary) {
        System.out.println("\n--- LEVENSHTEIN DISTANCE: Transaction Correction ---");
        System.out.println("Source: " + input);
        String closest = LevenshteinDistance.getClosestDescription(input, dictionary);
        int dist = closest != null ? LevenshteinDistance.calculate(input, closest) : -1;
        System.out.println("Target: " + closest);
        System.out.println("Minimum Edit Distance: " + dist);
        System.out.println("FinServe Use: Correcting transaction-description typing errors.");
    }

    /**
     * 2. Handle typing/transposition errors -> Damerau-Levenshtein
     */
    public void handleTypingTransposition(String source, String target) {
        System.out.println("\n--- DAMERAU-LEVENSHTEIN: Transposition Handling ---");
        System.out.println("Source: " + source);
        System.out.println("Target: " + target);
        int dist = DamerauLevenshtein.calculate(source, target);
        System.out.println("Minimum Edit Distance: " + dist);
        System.out.println("FinServe Use: Correcting adjacent-character typing mistakes in payment references.");
    }

    /**
     * 3. Calculate financial-data correction cost -> Weighted Edit Distance
     */
    public void calculateCorrectionCost(String source, String target, int iCost, int dCost, int sCost) {
        System.out.println("\n--- WEIGHTED EDIT DISTANCE: Financial Correction Cost ---");
        System.out.println("Source: " + source);
        System.out.println("Target: " + target);
        System.out.println("Costs -> Insert: " + iCost + ", Delete: " + dCost + ", Substitute: " + sCost);
        int cost = WeightedEditDistance.calculate(source, target, iCost, dCost, sCost);
        System.out.println("Minimum Weighted Cost: " + cost);
        System.out.println("FinServe Use: Calculating penalty costs for different types of financial data entry errors.");
    }

    /**
     * 4. Assign financial analysts optimally -> Bitmask DP
     */
    public void assignAnalystsOptimally(int[][] costMatrix) {
        System.out.println("\n--- BITMASK DP: Optimal Analyst Assignment ---");
        BitmaskAssignment.AssignmentResult result = BitmaskAssignment.minimumCost(costMatrix);
        System.out.println("Minimum Total Assignment Cost: " + result.minCost);
        System.out.println("Optimal Assignment:");
        String[] ops = {"Fraud Review", "Transaction Verification", "Account Validation", "Payment Investigation"};
        for (int i = 0; i < result.assignment.length; i++) {
            String opName = i < ops.length ? ops[i] : "Operation " + (i + 1);
            System.out.println(" * " + opName + " -> Analyst " + (result.assignment[i] + 1));
        }
        System.out.println("FinServe Use: Assigning combinations of financial operations or analysts while minimizing total processing cost.");
    }

    /**
     * 5. Optimize financial analytical operations -> Matrix-Chain Multiplication
     */
    public void optimizeAnalyticalOperations(int[] dimensions) {
        System.out.println("\n--- MATRIX-CHAIN MULTIPLICATION: Operation Optimization ---");
        System.out.println("Dimensions: " + Arrays.toString(dimensions));
        MatrixChainMultiplication.MCMResult result = MatrixChainMultiplication.minimumMultiplicationCost(dimensions);
        System.out.println("Minimum Cost: " + result.minCost);
        System.out.println("Optimal Order: " + result.optimalOrder);
        System.out.println("FinServe Use: Optimizing the computational order of multiple financial analytical operations.");
    }
}
