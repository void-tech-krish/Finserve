package com.finserve.module2.algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SuffixArray {

    public static int[] buildSuffixArray(String text) {
        if (text == null || text.isEmpty()) {
            return new int[0];
        }
        int n = text.length();
        Integer[] sa = new Integer[n];
        for (int i = 0; i < n; i++) {
            sa[i] = i;
        }

        Arrays.sort(sa, (a, b) -> {
            int lenA = n - a;
            int lenB = n - b;
            int minLen = Math.min(lenA, lenB);
            for (int i = 0; i < minLen; i++) {
                char cA = text.charAt(a + i);
                char cB = text.charAt(b + i);
                if (cA != cB) {
                    return cA - cB;
                }
            }
            return lenA - lenB;
        });

        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[i] = sa[i];
        }
        return result;
    }

    public static List<Integer> search(String text, String pattern, int[] sa) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.isEmpty() || text.isEmpty() || sa.length == 0) {
            return matches;
        }

        int n = text.length();
        int m = pattern.length();
        
        int l = 0, r = n - 1;
        int firstMatch = -1;
        
        // Find the first occurrence
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int suffixIndex = sa[mid];
            int cmp = comparePatternToSuffix(text, suffixIndex, pattern);
            
            if (cmp == 0) {
                firstMatch = mid;
                r = mid - 1; // look for earlier matches in the suffix array
            } else if (cmp < 0) {
                r = mid - 1; // pattern < suffix
            } else {
                l = mid + 1; // pattern > suffix
            }
        }
        
        if (firstMatch != -1) {
            matches.add(sa[firstMatch]);
            int idx = firstMatch + 1;
            while (idx < n && comparePatternToSuffix(text, sa[idx], pattern) == 0) {
                matches.add(sa[idx]);
                idx++;
            }
        }
        
        return matches;
    }
    
    private static int comparePatternToSuffix(String text, int suffixIndex, String pattern) {
        int m = pattern.length();
        int n = text.length();
        for (int i = 0; i < m; i++) {
            if (suffixIndex + i >= n) {
                return 1; // pattern is longer than suffix, so pattern > suffix
            }
            char textChar = text.charAt(suffixIndex + i);
            char patChar = pattern.charAt(i);
            if (patChar != textChar) {
                return patChar - textChar;
            }
        }
        return 0; // Pattern matches the prefix of the suffix
    }
}
