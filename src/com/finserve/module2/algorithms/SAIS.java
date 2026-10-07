package com.finserve.module2.algorithms;

public class SAIS {

    // Helper to get character at index i or 0 if out of bounds (useful as a sentinel)
    private static int getChar(int[] t, int i) {
        return i < t.length ? t[i] : 0;
    }

    public static int[] buildSuffixArray(String text) {
        if (text == null || text.isEmpty()) {
            return new int[0];
        }
        
        int n = text.length();
        // Convert string to int array, appending 0 as terminal character
        int[] t = new int[n + 1];
        int k = 256; // ASCII size + 1 (for 0 terminal)
        for (int i = 0; i < n; i++) {
            t[i] = text.charAt(i); // Assume 1-255 characters
            if (t[i] >= k) k = t[i] + 1;
        }
        t[n] = 0; 
        
        int[] sa = sais(t, k);
        
        // Remove the sentinel from the suffix array
        int[] result = new int[n];
        for (int i = 1; i <= n; i++) {
            result[i - 1] = sa[i];
        }
        
        return result;
    }

    private static int[] sais(int[] t, int k) {
        int n = t.length;
        int[] sa = new int[n];
        for (int i = 0; i < n; i++) sa[i] = -1;

        // Classify characters: false = S-type, true = L-type
        boolean[] isL = new boolean[n];
        isL[n - 1] = false; // sentinel is S-type
        for (int i = n - 2; i >= 0; i--) {
            isL[i] = (t[i] > t[i + 1]) || (t[i] == t[i + 1] && isL[i + 1]);
        }

        // Find LMS characters
        boolean[] isLMS = new boolean[n];
        int lmsCount = 0;
        for (int i = 1; i < n; i++) {
            if (!isL[i] && isL[i - 1]) {
                isLMS[i] = true;
                lmsCount++;
            }
        }

        // Calculate bin boundaries
        int[] binCount = new int[k];
        for (int i = 0; i < n; i++) binCount[t[i]]++;
        
        // Helper method to induce sorting
        induceSort(t, sa, isL, isLMS, k, binCount);

        // Compact the sorted LMS substrings
        int lmsIdx = 0;
        int[] compactSA = new int[lmsCount];
        for (int i = 0; i < n; i++) {
            if (sa[i] > 0 && isLMS[sa[i]]) {
                compactSA[lmsIdx++] = sa[i];
            }
        }
        
        // Initialize sa array to -1 again
        for (int i = 0; i < n; i++) sa[i] = -1;
        
        // Name the LMS substrings
        int[] lmsNames = new int[n];
        for (int i = 0; i < n; i++) lmsNames[i] = -1;
        
        int name = 0;
        int prevLms = -1;
        for (int i = 0; i < lmsCount; i++) {
            int currLms = compactSA[i];
            
            // Check if curr LMS matches prev LMS
            boolean diff = false;
            if (prevLms == -1) {
                diff = true;
            } else {
                int d = 0;
                while (true) {
                    if (t[currLms + d] != t[prevLms + d] || isL[currLms + d] != isL[prevLms + d]) {
                        diff = true;
                        break;
                    } else if (d > 0 && (isLMS[currLms + d] || isLMS[prevLms + d])) {
                        break;
                    }
                    d++;
                }
            }
            if (diff) {
                name++;
                prevLms = currLms;
            }
            lmsNames[currLms] = name - 1;
        }

        // Construct reduced problem
        int[] s1 = new int[lmsCount];
        int[] p1 = new int[lmsCount];
        int idx = 0;
        for (int i = 0; i < n; i++) {
            if (lmsNames[i] != -1) {
                s1[idx] = lmsNames[i];
                p1[idx] = i;
                idx++;
            }
        }

        int[] sa1;
        if (name < lmsCount) {
            // Recursive call if names are not unique
            sa1 = sais(s1, name);
        } else {
            // Base case, directly compute SA1
            sa1 = new int[lmsCount];
            for (int i = 0; i < lmsCount; i++) {
                sa1[s1[i]] = i;
            }
        }

        // Induced sorting for the final SA
        for (int i = 0; i < lmsCount; i++) compactSA[i] = p1[sa1[i]];
        
        for (int i = 0; i < n; i++) sa[i] = -1;
        
        // Put LMS back into their bins
        int[] binTails = new int[k];
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += binCount[i];
            binTails[i] = sum - 1;
        }
        
        for (int i = lmsCount - 1; i >= 0; i--) {
            int curr = compactSA[i];
            sa[binTails[t[curr]]--] = curr;
        }
        
        induceSortL(t, sa, isL, k, binCount);
        induceSortS(t, sa, isL, k, binCount);

        return sa;
    }

    private static void induceSort(int[] t, int[] sa, boolean[] isL, boolean[] isLMS, int k, int[] binCount) {
        int n = t.length;
        
        // Place LMS characters at the ends of their bins
        int[] binTails = new int[k];
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += binCount[i];
            binTails[i] = sum - 1;
        }
        
        for (int i = 0; i < n; i++) {
            if (isLMS[i]) {
                sa[binTails[t[i]]--] = i;
            }
        }

        induceSortL(t, sa, isL, k, binCount);
        induceSortS(t, sa, isL, k, binCount);
    }
    
    private static void induceSortL(int[] t, int[] sa, boolean[] isL, int k, int[] binCount) {
        int n = t.length;
        int[] binHeads = new int[k];
        int sum = 0;
        for (int i = 0; i < k; i++) {
            binHeads[i] = sum;
            sum += binCount[i];
        }
        
        for (int i = 0; i < n; i++) {
            if (sa[i] > 0 && isL[sa[i] - 1]) {
                sa[binHeads[t[sa[i] - 1]]++] = sa[i] - 1;
            }
        }
    }
    
    private static void induceSortS(int[] t, int[] sa, boolean[] isL, int k, int[] binCount) {
        int n = t.length;
        int[] binTails = new int[k];
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += binCount[i];
            binTails[i] = sum - 1;
        }
        
        for (int i = n - 1; i >= 0; i--) {
            if (sa[i] > 0 && !isL[sa[i] - 1]) {
                sa[binTails[t[sa[i] - 1]]--] = sa[i] - 1;
            }
        }
    }
}
