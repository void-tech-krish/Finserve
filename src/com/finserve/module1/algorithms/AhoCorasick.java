package com.finserve.module1.algorithms;

import java.util.*;

public class AhoCorasick {

    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        TrieNode fail;
        List<String> output = new ArrayList<>();
    }

    private TrieNode root;

    public AhoCorasick() {
        root = new TrieNode();
    }

    /**
     * Adds a pattern to the Trie.
     * @param pattern The pattern to add.
     */
    public void addPattern(String pattern) {
        if (pattern == null || pattern.isEmpty()) return;
        TrieNode current = root;
        for (char c : pattern.toCharArray()) {
            current.children.putIfAbsent(c, new TrieNode());
            current = current.children.get(c);
        }
        current.output.add(pattern);
    }

    /**
     * Builds failure links for the Aho-Corasick automaton.
     */
    public void buildFailureLinks() {
        Queue<TrieNode> queue = new LinkedList<>();
        
        // Initialize failure links for nodes at depth 1 to point to root
        for (TrieNode child : root.children.values()) {
            child.fail = root;
            queue.add(child);
        }

        // BFS to set failure links
        while (!queue.isEmpty()) {
            TrieNode current = queue.poll();

            for (Map.Entry<Character, TrieNode> entry : current.children.entrySet()) {
                char c = entry.getKey();
                TrieNode child = entry.getValue();

                TrieNode failNode = current.fail;
                while (failNode != null && !failNode.children.containsKey(c)) {
                    failNode = failNode.fail;
                }

                if (failNode != null) {
                    child.fail = failNode.children.get(c);
                    child.output.addAll(child.fail.output);
                } else {
                    child.fail = root;
                }

                queue.add(child);
            }
        }
    }

    static class Match {
        public String pattern;
        public int startIndex;
        
        public Match(String pattern, int startIndex) {
            this.pattern = pattern;
            this.startIndex = startIndex;
        }

        @Override
        public String toString() {
            return pattern + " (at " + startIndex + ")";
        }
    }

    /**
     * Searches for multiple patterns in the text.
     * @param text The text to search in.
     * @return A map of matched patterns and their starting indices.
     */
    public Map<String, List<Integer>> search(String text) {
        Map<String, List<Integer>> matches = new HashMap<>();
        if (text == null || text.isEmpty()) return matches;

        TrieNode current = root;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);

            while (current != null && !current.children.containsKey(c)) {
                current = current.fail;
            }

            if (current == null) {
                current = root;
            } else {
                current = current.children.get(c);
                for (String pattern : current.output) {
                    matches.putIfAbsent(pattern, new ArrayList<>());
                    matches.get(pattern).add(i - pattern.length() + 1);
                }
            }
        }

        return matches;
    }
}
