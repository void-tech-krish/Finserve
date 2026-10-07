package com.finserve.audit.model;

import java.util.List;

public class ModuleCoverage {
    private String id;
    private String name;
    private String co;
    private String description;
    private int totalAlgorithms;
    private int implementedCount;
    private int usedCount;
    private int coveragePercent;
    private List<Algorithm> algorithms;

    public ModuleCoverage() {}

    public ModuleCoverage(String id, String name, String co, String description, int totalAlgorithms, int implementedCount, int usedCount, int coveragePercent, List<Algorithm> algorithms) {
        this.id = id;
        this.name = name;
        this.co = co;
        this.description = description;
        this.totalAlgorithms = totalAlgorithms;
        this.implementedCount = implementedCount;
        this.usedCount = usedCount;
        this.coveragePercent = coveragePercent;
        this.algorithms = algorithms;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCo() { return co; }
    public void setCo(String co) { this.co = co; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getTotalAlgorithms() { return totalAlgorithms; }
    public void setTotalAlgorithms(int totalAlgorithms) { this.totalAlgorithms = totalAlgorithms; }

    public int getImplementedCount() { return implementedCount; }
    public void setImplementedCount(int implementedCount) { this.implementedCount = implementedCount; }

    public int getUsedCount() { return usedCount; }
    public void setUsedCount(int usedCount) { this.usedCount = usedCount; }

    public int getCoveragePercent() { return coveragePercent; }
    public void setCoveragePercent(int coveragePercent) { this.coveragePercent = coveragePercent; }

    public List<Algorithm> getAlgorithms() { return algorithms; }
    public void setAlgorithms(List<Algorithm> algorithms) { this.algorithms = algorithms; }
}
