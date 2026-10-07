package com.finserve.module6.algorithms;

public class BlellochScan {

    /**
     * Performs a Blelloch Exclusive Parallel Prefix Scan.
     * 
     * @param arr The input array
     * @return An exclusive prefix sum array of the same length
     */
    public static long[] exclusiveScan(long[] arr) {
        if (arr == null || arr.length == 0) return new long[0];
        
        int n = arr.length;
        int nextPowerOfTwo = 1;
        while (nextPowerOfTwo < n) {
            nextPowerOfTwo *= 2;
        }

        long[] padArr = new long[nextPowerOfTwo];
        System.arraycopy(arr, 0, padArr, 0, n);

        // Upsweep (Reduce) Phase
        for (int d = 0; d < log2(nextPowerOfTwo); d++) {
            int step = 1 << (d + 1);
            int halfStep = 1 << d;
            for (int k = 0; k < nextPowerOfTwo; k += step) {
                padArr[k + step - 1] = padArr[k + halfStep - 1] + padArr[k + step - 1];
            }
        }

        // Downsweep Phase
        padArr[nextPowerOfTwo - 1] = 0; // Root set to identity
        for (int d = log2(nextPowerOfTwo) - 1; d >= 0; d--) {
            int step = 1 << (d + 1);
            int halfStep = 1 << d;
            for (int k = 0; k < nextPowerOfTwo; k += step) {
                long t = padArr[k + halfStep - 1];
                padArr[k + halfStep - 1] = padArr[k + step - 1];
                padArr[k + step - 1] = t + padArr[k + step - 1];
            }
        }

        // Trim back to original size
        long[] result = new long[n];
        System.arraycopy(padArr, 0, result, 0, n);
        return result;
    }

    private static int log2(int N) {
        return (int) (Math.log(N) / Math.log(2));
    }
}
