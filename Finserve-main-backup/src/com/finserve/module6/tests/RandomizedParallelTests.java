package com.finserve.module6.tests;

import com.finserve.module6.algorithms.*;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class RandomizedParallelTests {

    public static void main(String[] args) {
        System.out.println("Running Module 6 Tests...\n");
        testRandomizedQuickSort();
        testMillerRabin();
        testReservoirSampling();
        testBlellochScan();
        testParallelReduce();
        testBrentTheorem();
        System.out.println("\nAll Module 6 tests completed successfully!");
    }

    private static void testRandomizedQuickSort() {
        System.out.println("--- Testing Randomized QuickSort ---");
        long[] empty = {};
        RandomizedQuickSort.sort(empty, 42L);
        assertCondition(empty.length == 0, "QuickSort: Empty array handled");

        long[] single = {5};
        RandomizedQuickSort.sort(single, 42L);
        assertCondition(single[0] == 5, "QuickSort: Single element");

        long[] sorted = {1, 2, 3, 4, 5};
        RandomizedQuickSort.sort(sorted, 42L);
        assertCondition(Arrays.equals(sorted, new long[]{1, 2, 3, 4, 5}), "QuickSort: Already sorted");

        long[] reversed = {5, 4, 3, 2, 1};
        RandomizedQuickSort.sort(reversed, 42L);
        assertCondition(Arrays.equals(reversed, new long[]{1, 2, 3, 4, 5}), "QuickSort: Reverse sorted");

        long[] duplicates = {4, 1, 4, 1, 4};
        RandomizedQuickSort.sort(duplicates, 42L);
        assertCondition(Arrays.equals(duplicates, new long[]{1, 1, 4, 4, 4}), "QuickSort: Duplicates");

        long[] negative = {10, -5, 0, -100};
        RandomizedQuickSort.sort(negative, 42L);
        assertCondition(Arrays.equals(negative, new long[]{-100, -5, 0, 10}), "QuickSort: Negative numbers");
        
        System.out.println("Randomized QuickSort tests passed.");
    }

    private static void testMillerRabin() {
        System.out.println("--- Testing Miller-Rabin ---");
        assertCondition(!MillerRabin.isPrime(0, 5), "Miller-Rabin: 0");
        assertCondition(!MillerRabin.isPrime(1, 5), "Miller-Rabin: 1");
        assertCondition(MillerRabin.isPrime(2, 5), "Miller-Rabin: 2");
        assertCondition(MillerRabin.isPrime(3, 5), "Miller-Rabin: 3");
        assertCondition(!MillerRabin.isPrime(4, 5), "Miller-Rabin: 4");
        assertCondition(MillerRabin.isPrime(5, 5), "Miller-Rabin: 5");
        assertCondition(!MillerRabin.isPrime(9, 5), "Miller-Rabin: 9");
        assertCondition(MillerRabin.isPrime(17, 5), "Miller-Rabin: 17");
        assertCondition(!MillerRabin.isPrime(25, 5), "Miller-Rabin: 25");
        assertCondition(MillerRabin.isPrime(97, 5), "Miller-Rabin: 97");
        assertCondition(MillerRabin.isPrime(101, 5), "Miller-Rabin: 101");

        // Carmichael numbers
        assertCondition(!MillerRabin.isPrime(561, 10), "Miller-Rabin: Carmichael 561");
        assertCondition(!MillerRabin.isPrime(1105, 10), "Miller-Rabin: Carmichael 1105");
        assertCondition(!MillerRabin.isPrime(1729, 10), "Miller-Rabin: Carmichael 1729");

        System.out.println("Miller-Rabin tests passed.");
    }

    private static void testReservoirSampling() {
        System.out.println("--- Testing Reservoir Sampling ---");
        List<Integer> empty = new ArrayList<>();
        assertCondition(ReservoirSampling.sample(empty, 5, 42L).size() == 0, "ReservoirSampling: Empty stream");

        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
        assertCondition(ReservoirSampling.sample(list, 0, 42L).size() == 0, "ReservoirSampling: k = 0");
        assertCondition(ReservoirSampling.sample(list, 1, 42L).size() == 1, "ReservoirSampling: k = 1");
        assertCondition(ReservoirSampling.sample(list, 5, 42L).size() == 5, "ReservoirSampling: k = n");
        assertCondition(ReservoirSampling.sample(list, 10, 42L).size() == 5, "ReservoirSampling: k > n");

        List<Integer> sample = ReservoirSampling.sample(list, 3, 42L);
        assertCondition(sample.size() == 3, "ReservoirSampling: k < n");
        assertCondition(list.containsAll(sample), "ReservoirSampling: valid elements");

        System.out.println("Reservoir Sampling tests passed.");
    }

    private static void testBlellochScan() {
        System.out.println("--- Testing Blelloch Scan ---");
        assertCondition(BlellochScan.exclusiveScan(new long[]{}).length == 0, "BlellochScan: Empty array");
        assertCondition(Arrays.equals(BlellochScan.exclusiveScan(new long[]{5}), new long[]{0}), "BlellochScan: One element");

        long[] p2 = {10, 20, 30, 40};
        assertCondition(Arrays.equals(BlellochScan.exclusiveScan(p2), new long[]{0, 10, 30, 60}), "BlellochScan: Power of two length");

        long[] np2 = {10, 20, 30, 40, 50};
        assertCondition(Arrays.equals(BlellochScan.exclusiveScan(np2), new long[]{0, 10, 30, 60, 100}), "BlellochScan: Non power of two length");

        long[] neg = {-5, 10, -2};
        assertCondition(Arrays.equals(BlellochScan.exclusiveScan(neg), new long[]{0, -5, 5}), "BlellochScan: Negative numbers");

        System.out.println("Blelloch Scan tests passed.");
    }

    private static void testParallelReduce() {
        System.out.println("--- Testing Parallel Reduce ---");
        assertCondition(ParallelReduce.sum(new long[]{}, 2) == 0, "ParallelReduce: Empty array");
        assertCondition(ParallelReduce.sum(new long[]{5}, 2) == 5, "ParallelReduce: One element");

        long[] multiple = {1000, 2000, 1500, 3000, 500};
        assertCondition(ParallelReduce.sum(multiple, 1) == 8000, "ParallelReduce: Worker count 1");
        assertCondition(ParallelReduce.sum(multiple, 2) == 8000, "ParallelReduce: Worker count 2");
        assertCondition(ParallelReduce.sum(multiple, 4) == 8000, "ParallelReduce: Worker count 4");
        assertCondition(ParallelReduce.sum(multiple, 10) == 8000, "ParallelReduce: Worker count > size");

        long[] negative = {10, -20, 5};
        assertCondition(ParallelReduce.sum(negative, 2) == -5, "ParallelReduce: Negative values");

        System.out.println("Parallel Reduce tests passed.");
    }

    private static void testBrentTheorem() {
        System.out.println("--- Testing Brent's Theorem ---");
        BrentTheorem.BrentAnalysis analysis = BrentTheorem.analyze(1000, 100, 8);
        assertCondition(analysis.work == 1000, "BrentTheorem: Valid work");
        assertCondition(analysis.span == 100, "BrentTheorem: Valid span");
        assertCondition(analysis.lowerBound <= analysis.upperBound, "BrentTheorem: Mathematical validity");

        BrentTheorem.BrentAnalysis single = BrentTheorem.analyze(1000, 100, 1);
        assertCondition(single.lowerBound == 1000 && single.upperBound == 1000, "BrentTheorem: P = 1");

        try {
            BrentTheorem.analyze(0, 10, 1);
            throw new RuntimeException("BrentTheorem: Invalid work FAILED.");
        } catch (IllegalArgumentException e) {
            // Passed
        }

        try {
            BrentTheorem.analyze(100, 200, 1);
            throw new RuntimeException("BrentTheorem: Invalid span > work FAILED.");
        } catch (IllegalArgumentException e) {
            // Passed
        }

        System.out.println("Brent's Theorem tests passed.");
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new RuntimeException(message + " FAILED.");
        }
    }
}
