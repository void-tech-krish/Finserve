package com.finserve.module1.algorithms;

import java.util.ArrayList;
import java.util.List;

public class RabinKarp {
    // Prime number for hashing
    private final static int PRIME = 101;
    // Base for ASCII characters (or typical char range)
    private final static int ALPHABET_SIZE = 256;

    /**
     * Searches for a pattern in a text using the Rabin-Karp algorithm.
     * @param text The text to search in.
     * @param pattern The pattern to search for.
     * @return A list of starting indices where pattern is found.
     */
    public static List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.length() == 0 || text.length() < pattern.length()) {
            return matches;
        }

        int m = pattern.length();
        int n = text.length();
        int patternHash = 0;
        int textHash = 0;
        int h = 1;

        // Calculate h = pow(ALPHABET_SIZE, m-1) % PRIME
        for (int i = 0; i < m - 1; i++) {
            h = (h * ALPHABET_SIZE) % PRIME;
        }

        // Calculate hash value for pattern and first window of text
        for (int i = 0; i < m; i++) {
            patternHash = (ALPHABET_SIZE * patternHash + pattern.charAt(i)) % PRIME;
            textHash = (ALPHABET_SIZE * textHash + text.charAt(i)) % PRIME;
        }

        // Slide the pattern over text one by one
        for (int i = 0; i <= n - m; i++) {
            // Check the hash values of current window of text and pattern.
            // If the hash values match, then only check for characters one by one
            if (patternHash == textHash) {
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    if (text.charAt(i + j) != pattern.charAt(j)) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    matches.add(i);
                }
            }

            // Calculate hash value for next window of text: Remove leading digit, add trailing digit
            if (i < n - m) {
                textHash = (ALPHABET_SIZE * (textHash - text.charAt(i) * h) + text.charAt(i + m)) % PRIME;
                // We might get negative value of textHash, converting it to positive
                if (textHash < 0) {
                    textHash = (textHash + PRIME);
                }
            }
        }
        return matches;
    }
}
