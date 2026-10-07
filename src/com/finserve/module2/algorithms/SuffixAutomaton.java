package com.finserve.module2.algorithms;

import java.util.HashMap;
import java.util.Map;

public class SuffixAutomaton {
    
    static class State {
        int len;
        int link;
        Map<Character, Integer> next = new HashMap<>();
        
        public State(int len, int link) {
            this.len = len;
            this.link = link;
        }
    }
    
    private State[] st;
    private int sz;
    private int last;
    
    public SuffixAutomaton(int maxLen) {
        st = new State[maxLen * 2];
        for (int i = 0; i < st.length; i++) {
            st[i] = new State(0, -1);
        }
        st[0] = new State(0, -1);
        sz = 1;
        last = 0;
    }
    
    public SuffixAutomaton() {
        this(100000); // Default capacity
    }
    
    public void build(String text) {
        st[0] = new State(0, -1);
        sz = 1;
        last = 0;
        
        if (text == null || text.isEmpty()) return;
        for (char c : text.toCharArray()) {
            extend(c);
        }
    }
    
    private void extend(char c) {
        int cur = sz++;
        st[cur].len = st[last].len + 1;
        
        int p = last;
        while (p != -1 && !st[p].next.containsKey(c)) {
            st[p].next.put(c, cur);
            p = st[p].link;
        }
        
        if (p == -1) {
            st[cur].link = 0;
        } else {
            int q = st[p].next.get(c);
            if (st[p].len + 1 == st[q].len) {
                st[cur].link = q;
            } else {
                int clone = sz++;
                st[clone].len = st[p].len + 1;
                st[clone].next = new HashMap<>(st[q].next);
                st[clone].link = st[q].link;
                while (p != -1 && st[p].next.get(c) == q) {
                    st[p].next.put(c, clone);
                    p = st[p].link;
                }
                st[q].link = st[cur].link = clone;
            }
        }
        last = cur;
    }
    
    public boolean contains(String pattern) {
        if (pattern == null || pattern.isEmpty()) return true;
        int cur = 0;
        for (char c : pattern.toCharArray()) {
            if (!st[cur].next.containsKey(c)) {
                return false;
            }
            cur = st[cur].next.get(c);
        }
        return true;
    }
    
    public long countDistinctSubstrings() {
        long count = 0;
        for (int i = 1; i < sz; i++) {
            count += st[i].len - st[st[i].link].len;
        }
        return count;
    }
    
    public String longestCommonSubstring(String otherText) {
        if (otherText == null || otherText.isEmpty()) return "";
        
        int v = 0, l = 0, best = 0, bestpos = 0;
        for (int i = 0; i < otherText.length(); i++) {
            char c = otherText.charAt(i);
            while (v != 0 && !st[v].next.containsKey(c)) {
                v = st[v].link;
                l = st[v].len;
            }
            if (st[v].next.containsKey(c)) {
                v = st[v].next.get(c);
                l++;
            }
            if (l > best) {
                best = l;
                bestpos = i;
            }
        }
        return otherText.substring(bestpos - best + 1, bestpos + 1);
    }
}
