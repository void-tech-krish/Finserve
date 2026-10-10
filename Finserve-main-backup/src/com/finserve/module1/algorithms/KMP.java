package com.finserve.module1.algorithms;

import java.util.ArrayList;
import java.util.List;

public class KMP {
    /**
     * Searches for occurrences of a pattern within a text using KMP algorithm.
     * @param text The text to search in.
     * @param pattern The pattern to search for.
     * @return A list of starting indices where the pattern is found.
     */
    public static List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.length() == 0 || text.length() < pattern.length()) {
            return matches;
        }

        int[] lps = buildLPS(pattern);
        int i = 0; // index for text
        int j = 0; // index for pattern

        while (i < text.length()) {
            if (pattern.charAt(j) == text.charAt(i)) {
                j++;
                i++;
            }
            if (j == pattern.length()) {
                matches.add(i - j);
                j = lps[j - 1];
            } else if (i < text.length() && pattern.charAt(j) != text.charAt(i)) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        return matches;
    }

    private static int[] buildLPS(String pattern) {
        int[] lps = new int[pattern.length()];
        int len = 0;
        int i = 1;
        lps[0] = 0;

        while (i < pattern.length()) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }
}
