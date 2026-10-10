package com.finserve.module6.algorithms;

import java.util.Random;

public class RandomizedQuickSort {

    /**
     * Sorts the given array in-place using Randomized QuickSort.
     * @param arr the array to sort
     * @param seed optional seed for reproducible tests. If null, a random seed is used.
     */
    public static void sort(long[] arr, Long seed) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        Random random = (seed != null) ? new Random(seed) : new Random();
        quickSort(arr, 0, arr.length - 1, random);
    }

    private static void quickSort(long[] arr, int low, int high, Random random) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high, random);
            quickSort(arr, low, pivotIndex - 1, random);
            quickSort(arr, pivotIndex + 1, high, random);
        }
    }

    private static int partition(long[] arr, int low, int high, Random random) {
        // Select a random pivot index between low and high (inclusive)
        int pivotIndex = low + random.nextInt(high - low + 1);
        
        // Swap pivot with high
        long temp = arr[pivotIndex];
        arr[pivotIndex] = arr[high];
        arr[high] = temp;

        long pivotValue = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivotValue) {
                i++;
                // Swap arr[i] and arr[j]
                long t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }

        // Swap arr[i+1] and arr[high] (pivot)
        long t = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = t;

        return i + 1;
    }
}
