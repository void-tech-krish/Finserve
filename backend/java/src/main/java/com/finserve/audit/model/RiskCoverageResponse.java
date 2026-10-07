package com.finserve.audit.model;

import java.util.List;

public class RiskCoverageResponse {
    private String algorithm;
    private int nodes;
    private int riskyEdges;
    private List<String> selectedEntities;
    private int coveredEdges;
    private int coveragePercentage;
    private boolean validVertexCover;
    private Integer exactCoverSize;
    private Integer approximateCoverSize;
    private Double approximationRatio;

    public RiskCoverageResponse(String algorithm, int nodes, int riskyEdges, List<String> selectedEntities, int coveredEdges, int coveragePercentage, boolean validVertexCover, Integer exactCoverSize, Integer approximateCoverSize, Double approximationRatio) {
        this.algorithm = algorithm;
        this.nodes = nodes;
        this.riskyEdges = riskyEdges;
        this.selectedEntities = selectedEntities;
        this.coveredEdges = coveredEdges;
        this.coveragePercentage = coveragePercentage;
        this.validVertexCover = validVertexCover;
        this.exactCoverSize = exactCoverSize;
        this.approximateCoverSize = approximateCoverSize;
        this.approximationRatio = approximationRatio;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public int getNodes() {
        return nodes;
    }

    public void setNodes(int nodes) {
        this.nodes = nodes;
    }

    public int getRiskyEdges() {
        return riskyEdges;
    }

    public void setRiskyEdges(int riskyEdges) {
        this.riskyEdges = riskyEdges;
    }

    public List<String> getSelectedEntities() {
        return selectedEntities;
    }

    public void setSelectedEntities(List<String> selectedEntities) {
        this.selectedEntities = selectedEntities;
    }

    public int getCoveredEdges() {
        return coveredEdges;
    }

    public void setCoveredEdges(int coveredEdges) {
        this.coveredEdges = coveredEdges;
    }

    public int getCoveragePercentage() {
        return coveragePercentage;
    }

    public void setCoveragePercentage(int coveragePercentage) {
        this.coveragePercentage = coveragePercentage;
    }

    public boolean isValidVertexCover() {
        return validVertexCover;
    }

    public void setValidVertexCover(boolean validVertexCover) {
        this.validVertexCover = validVertexCover;
    }

    public Integer getExactCoverSize() {
        return exactCoverSize;
    }

    public void setExactCoverSize(Integer exactCoverSize) {
        this.exactCoverSize = exactCoverSize;
    }

    public Integer getApproximateCoverSize() {
        return approximateCoverSize;
    }

    public void setApproximateCoverSize(Integer approximateCoverSize) {
        this.approximateCoverSize = approximateCoverSize;
    }

    public Double getApproximationRatio() {
        return approximationRatio;
    }

    public void setApproximationRatio(Double approximationRatio) {
        this.approximationRatio = approximationRatio;
    }
}
