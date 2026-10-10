package com.finserve.module6.algorithms;

import java.math.BigInteger;

public class MillerRabin {

    /**
     * Tests if the number is prime using the Miller-Rabin Primality Test.
     * 
     * @param n the number to test
     * @param iterations the number of rounds to perform
     * @return true if probably prime, false if composite
     */
    public static boolean isPrime(long n, int iterations) {
        if (n < 2) return false;
        if (n == 2 || n == 3) return true;
        if (n % 2 == 0) return false;

        // Find d such that n - 1 = d * 2^r
        long d = n - 1;
        int r = 0;
        while (d % 2 == 0) {
            d /= 2;
            r++;
        }

        // We use BigInteger for modular arithmetic to easily avoid long overflow
        BigInteger bigN = BigInteger.valueOf(n);
        BigInteger bigD = BigInteger.valueOf(d);
        BigInteger bigNMinus1 = bigN.subtract(BigInteger.ONE);

        // Deterministic bases for values up to 2^64
        int[] bases = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};

        for (int i = 0; i < iterations && i < bases.length; i++) {
            long a = bases[i];
            if (a >= n) break; // if the base is greater than or equal to n, skip

            BigInteger bigA = BigInteger.valueOf(a);
            BigInteger x = bigA.modPow(bigD, bigN);

            if (x.equals(BigInteger.ONE) || x.equals(bigNMinus1)) {
                continue; // Pass
            }

            boolean composite = true;
            for (int j = 1; j < r; j++) {
                x = x.modPow(BigInteger.TWO, bigN);
                if (x.equals(bigNMinus1)) {
                    composite = false;
                    break;
                }
            }

            if (composite) {
                return false;
            }
        }

        return true;
    }
}
