package com.finserve.module2.algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SuffixTree {
    
    // A simplified Suffix Tree node
    static class Node {
        Map<Character, Node> children = new HashMap<>();
        List<Integer> indexes = new ArrayList<>();
    }

    private Node root;

    public SuffixTree() {
        root = new Node();
    }

    public void build(String text) {
        root = new Node();
        if (text == null || text.isEmpty()) return;
        
        // Append terminal symbol
        String s = text + "$";
        for (int i = 0; i < s.length(); i++) {
            insertSuffix(s.substring(i), i);
        }
    }

    private void insertSuffix(String suffix, int index) {
        Node current = root;
        current.indexes.add(index);
        
        for (char c : suffix.toCharArray()) {
            current.children.putIfAbsent(c, new Node());
            current = current.children.get(c);
            current.indexes.add(index);
        }
    }

    public boolean contains(String pattern) {
        Node node = searchNode(pattern);
        return node != null;
    }

    public List<Integer> search(String pattern) {
        Node node = searchNode(pattern);
        if (node == null) {
            return new ArrayList<>();
        }
        return node.indexes;
    }

    private Node searchNode(String pattern) {
        if (pattern == null || pattern.isEmpty()) return root;
        Node current = root;
        for (char c : pattern.toCharArray()) {
            if (!current.children.containsKey(c)) {
                return null;
            }
            current = current.children.get(c);
        }
        return current;
    }
}
