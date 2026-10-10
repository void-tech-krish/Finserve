package com.finserve.module5.algorithms;

import java.util.List;

public class ThreeSAT {

    public static class SATResult {
        public boolean satisfiable;
        public boolean[] assignment; // 1-indexed

        public SATResult(boolean satisfiable, boolean[] assignment) {
            this.satisfiable = satisfiable;
            this.assignment = assignment;
        }
    }

    /**
     * Solves a 3-SAT formula using exhaustive search.
     * @param numVariables Number of distinct boolean variables
     * @param clauses List of int arrays, where each array must have length 3.
     *                Positive integers represent true literals (e.g. 1 means x1), 
     *                Negative integers represent false literals (e.g. -2 means !x2).
     * @return SATResult containing true/false and the assignment if satisfiable.
     */
    public static SATResult solve(int numVariables, List<int[]> clauses) {
        if (clauses == null || clauses.isEmpty()) {
            return new SATResult(true, new boolean[numVariables + 1]);
        }

        // Validate clause sizes
        for (int[] clause : clauses) {
            if (clause.length != 3) {
                throw new IllegalArgumentException("Each clause must contain exactly 3 literals.");
            }
        }

        int combinations = 1 << numVariables;
        for (int mask = 0; mask < combinations; mask++) {
            boolean[] assignment = new boolean[numVariables + 1];
            for (int i = 0; i < numVariables; i++) {
                if ((mask & (1 << i)) != 0) {
                    assignment[i + 1] = true;
                }
            }

            if (isSatisfied(assignment, clauses)) {
                return new SATResult(true, assignment);
            }
        }

        return new SATResult(false, null);
    }

    private static boolean isSatisfied(boolean[] assignment, List<int[]> clauses) {
        for (int[] clause : clauses) {
            boolean clauseSatisfied = false;
            for (int literal : clause) {
                int var = Math.abs(literal);
                boolean value = assignment[var];
                if (literal < 0) {
                    value = !value;
                }
                if (value) {
                    clauseSatisfied = true;
                    break;
                }
            }
            if (!clauseSatisfied) {
                return false;
            }
        }
        return true;
    }
}
