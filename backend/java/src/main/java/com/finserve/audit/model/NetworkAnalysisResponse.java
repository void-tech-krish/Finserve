package com.finserve.audit.model;

import java.util.List;

public class NetworkAnalysisResponse {
    private String source;
    private String sink;
    private String algorithm;
    private int maxFlow;
    private Integer minCutCapacity;
    private List<CriticalEdge> criticalEdges;
    private String networkStatus;

    public NetworkAnalysisResponse() {}

    public NetworkAnalysisResponse(String source, String sink, String algorithm, int maxFlow, Integer minCutCapacity, List<CriticalEdge> criticalEdges, String networkStatus) {
        this.source = source;
        this.sink = sink;
        this.algorithm = algorithm;
        this.maxFlow = maxFlow;
        this.minCutCapacity = minCutCapacity;
        this.criticalEdges = criticalEdges;
        this.networkStatus = networkStatus;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getSink() { return sink; }
    public void setSink(String sink) { this.sink = sink; }
    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }
    public int getMaxFlow() { return maxFlow; }
    public void setMaxFlow(int maxFlow) { this.maxFlow = maxFlow; }
    public Integer getMinCutCapacity() { return minCutCapacity; }
    public void setMinCutCapacity(Integer minCutCapacity) { this.minCutCapacity = minCutCapacity; }
    public List<CriticalEdge> getCriticalEdges() { return criticalEdges; }
    public void setCriticalEdges(List<CriticalEdge> criticalEdges) { this.criticalEdges = criticalEdges; }
    public String getNetworkStatus() { return networkStatus; }
    public void setNetworkStatus(String networkStatus) { this.networkStatus = networkStatus; }

    public static class CriticalEdge {
        private String from;
        private String to;
        private int capacity;

        public CriticalEdge(String from, String to, int capacity) {
            this.from = from;
            this.to = to;
            this.capacity = capacity;
        }

        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        public String getTo() { return to; }
        public void setTo(String to) { this.to = to; }
        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
    }
}
