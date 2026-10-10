package com.finserve.module6.algorithms;

public class BrentTheorem {

    public static class BrentAnalysis {
        public long work;
        public long span;
        public int processors;
        public double lowerBound;
        public double upperBound;
        public double estimatedSpeedup;
        public double estimatedEfficiency;
        
        public BrentAnalysis(long work, long span, int processors, double lowerBound, double upperBound) {
            this.work = work;
            this.span = span;
            this.processors = processors;
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
            this.estimatedSpeedup = (double) work / upperBound;
            this.estimatedEfficiency = this.estimatedSpeedup / processors;
        }
    }

    /**
     * Analyzes parallel execution bounds based on Brent's Theorem.
     * 
     * @param work Total number of operations
     * @param span Length of the critical path
     * @param processors Number of parallel processors
     * @return BrentAnalysis object containing bounds and efficiencies
     */
    public static BrentAnalysis analyze(long work, long span, int processors) {
        if (work <= 0 || span <= 0 || processors <= 0) {
            throw new IllegalArgumentException("Work, span, and processors must be strictly positive.");
        }
        if (span > work) {
            throw new IllegalArgumentException("Span cannot be greater than total work.");
        }

        double lowerBound = Math.max((double) work / processors, span);
        double upperBound = ((double) (work - span) / processors) + span;
        
        // Classic upper bound format is W/P + S, but (W - S)/P + S is the exact Brent's bound.
        // We will return the strict Brent bound since it is tighter.

        return new BrentAnalysis(work, span, processors, lowerBound, upperBound);
    }
}
