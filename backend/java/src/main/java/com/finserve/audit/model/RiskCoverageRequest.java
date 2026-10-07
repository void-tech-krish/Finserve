package com.finserve.audit.model;

import java.util.List;

public class RiskCoverageRequest {
    private List<String> nodes;
    private List<Edge> riskyEdges;

    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<Edge> getRiskyEdges() {
        return riskyEdges;
    }

    public void setRiskyEdges(List<Edge> riskyEdges) {
        this.riskyEdges = riskyEdges;
    }

    public static class Edge {
        private String from;
        private String to;

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
    }
}
