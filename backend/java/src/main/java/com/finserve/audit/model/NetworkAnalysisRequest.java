package com.finserve.audit.model;

import java.util.List;

public class NetworkAnalysisRequest {
    private List<String> nodes;
    private List<EdgeRequest> edges;
    private String source;
    private String sink;
    private String algorithm;

    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<EdgeRequest> getEdges() {
        return edges;
    }

    public void setEdges(List<EdgeRequest> edges) {
        this.edges = edges;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSink() {
        return sink;
    }

    public void setSink(String sink) {
        this.sink = sink;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public static class EdgeRequest {
        private String from;
        private String to;
        private int capacity;

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }
    }
}
