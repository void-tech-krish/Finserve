package com.finserve.module2.algorithms;

public class LCPKasai {

    public static int[] buildLCP(String text, int[] suffixArray) {
        if (text == null || text.isEmpty()) {
            return new int[0];
        }
        int n = text.length();
        int[] lcp = new int[n];
        int[] invSA = new int[n];
        
        // Build inverse suffix array
        for (int i = 0; i < n; i++) {
            invSA[suffixArray[i]] = i;
        }
        
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (invSA[i] == n - 1) {
                k = 0;
                continue;
            }
            
            int j = suffixArray[invSA[i] + 1];
            while (i + k < n && j + k < n && text.charAt(i + k) == text.charAt(j + k)) {
                k++;
            }
            lcp[invSA[i] + 1] = k;
            
            if (k > 0) {
                k--;
            }
        }
        return lcp;
    }

    public static class RepeatedSubstringResult {
        public String pattern;
        public int length;

        public RepeatedSubstringResult(String pattern, int length) {
            this.pattern = pattern;
            this.length = length;
        }
        
        @Override
        public String toString() {
            return "Pattern: '" + pattern + "', Length: " + length;
        }
    }

    public static RepeatedSubstringResult findLongestRepeatedSubstring(String text, int[] sa, int[] lcp) {
        if (text == null || text.isEmpty()) {
            return new RepeatedSubstringResult("", 0);
        }
        
        int maxLCP = 0;
        int index = 0;
        
        for (int i = 0; i < lcp.length; i++) {
            if (lcp[i] > maxLCP) {
                maxLCP = lcp[i];
                index = sa[i];
            }
        }
        
        if (maxLCP == 0) {
            return new RepeatedSubstringResult("", 0);
        }
        
        String pattern = text.substring(index, index + maxLCP);
        return new RepeatedSubstringResult(pattern, maxLCP);
    }
}
