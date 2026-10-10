package com.finserve.module1.algorithms;

import java.util.ArrayList;
import java.util.List;

public class ZFunction {
    
    /**
     * Builds the Z-array for a given string.
     * @param str The input string.
     * @return The Z-array.
     */
    public static int[] buildZArray(String str) {
        int n = str.length();
        int[] z = new int[n];
        int left = 0, right = 0;
        
        for (int i = 1; i < n; i++) {
            if (i > right) {
                left = right = i;
                while (right < n && str.charAt(right - left) == str.charAt(right)) {
                    right++;
                }
                z[i] = right - left;
                right--;
            } else {
                int k = i - left;
                if (z[k] < right - i + 1) {
                    z[i] = z[k];
                } else {
                    left = i;
                    while (right < n && str.charAt(right - left) == str.charAt(right)) {
                        right++;
                    }
                    z[i] = right - left;
                    right--;
                }
            }
        }
        return z;
    }

    /**
     * Searches for a pattern in text using Z-algorithm.
     * @param text The text to search in.
     * @param pattern The pattern to search for.
     * @return List of starting indices where pattern is found.
     */
    public static List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.length() == 0 || text.length() < pattern.length()) {
            return matches;
        }

        String concat = pattern + "$" + text;
        int[] z = buildZArray(concat);

        for (int i = 0; i < z.length; i++) {
            if (z[i] == pattern.length()) {
                matches.add(i - pattern.length() - 1);
            }
        }
        return matches;
    }
}
