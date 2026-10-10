package com.finserve.module6.algorithms;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ParallelReduce {

    /**
     * Computes the sum of an array in parallel.
     * 
     * @param arr The array of long values
     * @param numWorkers Number of threads to use
     * @return The sum
     */
    public static long sum(long[] arr, int numWorkers) {
        if (arr == null || arr.length == 0) return 0;
        if (numWorkers <= 0) numWorkers = 1;

        ExecutorService executor = Executors.newFixedThreadPool(numWorkers);
        List<Future<Long>> futures = new ArrayList<>();

        int chunkSize = (int) Math.ceil((double) arr.length / numWorkers);

        for (int i = 0; i < numWorkers; i++) {
            final int start = i * chunkSize;
            final int end = Math.min(start + chunkSize, arr.length);

            if (start >= arr.length) break;

            futures.add(executor.submit(new Callable<Long>() {
                @Override
                public Long call() {
                    long partialSum = 0;
                    for (int j = start; j < end; j++) {
                        partialSum += arr[j];
                    }
                    return partialSum;
                }
            }));
        }

        long totalSum = 0;
        try {
            for (Future<Long> future : futures) {
                totalSum += future.get();
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } finally {
            executor.shutdown();
        }

        return totalSum;
    }
}
