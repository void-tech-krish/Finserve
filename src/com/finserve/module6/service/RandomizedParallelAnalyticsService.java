package com.finserve.module6.service;

import com.finserve.module6.algorithms.*;
import java.util.Arrays;
import java.util.List;

public class RandomizedParallelAnalyticsService {

    public void rankTransactions(long[] transactions) {
        System.out.println("--- Randomized QuickSort: Transaction Ranking ---");
        System.out.println("Original: " + Arrays.toString(transactions));
        RandomizedQuickSort.sort(transactions, null);
        System.out.println("Ranked: " + Arrays.toString(transactions));
    }

    public void testLargeNumber(long number) {
        System.out.println("\n--- Miller-Rabin: Large Numerical Computations ---");
        System.out.println("Testing Primality for: " + number);
        boolean isPrime = MillerRabin.isPrime(number, 10);
        System.out.println("Is Prime? " + isPrime);
    }

    public void sampleTransactionStream(List<String> stream, int k) {
        System.out.println("\n--- Reservoir Sampling: Transaction Streams ---");
        List<String> sample = ReservoirSampling.sample(stream, k, null);
        System.out.println("Sampled " + k + " transactions: " + sample);
    }

    public void calculateCumulativeTransactions(long[] amounts) {
        System.out.println("\n--- Blelloch Scan: Cumulative Statistics ---");
        System.out.println("Amounts: " + Arrays.toString(amounts));
        long[] exclusiveScan = BlellochScan.exclusiveScan(amounts);
        System.out.println("Exclusive Cumulative: " + Arrays.toString(exclusiveScan));
    }

    public void aggregateTransactions(long[] amounts, int workers) {
        System.out.println("\n--- Parallel Reduce: Financial Aggregation ---");
        long total = ParallelReduce.sum(amounts, workers);
        System.out.println("Total aggregated across " + workers + " workers: " + total);
    }

    public void analyzeParallelProcessing(long work, long span, int processors) {
        System.out.println("\n--- Brent's Theorem: Parallel Processing Analysis ---");
        BrentTheorem.BrentAnalysis analysis = BrentTheorem.analyze(work, span, processors);
        System.out.println("Work: " + work + ", Span: " + span + ", Processors: " + processors);
        System.out.printf("Lower Bound (Time): %.2f\n", analysis.lowerBound);
        System.out.printf("Upper Bound (Time): %.2f\n", analysis.upperBound);
        System.out.printf("Estimated Speedup: %.2f\n", analysis.estimatedSpeedup);
    }
}
