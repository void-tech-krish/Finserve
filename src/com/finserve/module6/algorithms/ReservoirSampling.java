package com.finserve.module6.algorithms;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ReservoirSampling {

    /**
     * Algorithm R for Reservoir Sampling.
     * 
     * @param stream The continuous stream of transactions (Iterable)
     * @param k The sample size
     * @param seed Optional seed for reproducible tests
     * @return The reservoir containing at most k random elements
     */
    public static <T> List<T> sample(Iterable<T> stream, int k, Long seed) {
        List<T> reservoir = new ArrayList<>();
        if (k <= 0) {
            return reservoir;
        }

        Random random = (seed != null) ? new Random(seed) : new Random();
        int i = 0;

        for (T item : stream) {
            if (i < k) {
                // Fill the reservoir initially
                reservoir.add(item);
            } else {
                // Randomly replace elements with decreasing probability
                int j = random.nextInt(i + 1);
                if (j < k) {
                    reservoir.set(j, item);
                }
            }
            i++;
        }

        return reservoir;
    }
}
