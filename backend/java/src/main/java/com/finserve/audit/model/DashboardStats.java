package com.finserve.audit.model;

public class DashboardStats {
    private int totalAlgorithms;
    private int implemented;
    private int used;
    private int implementationCoverage;
    private int usageCoverage;
    private int modules;

    public DashboardStats() {}

    public DashboardStats(int totalAlgorithms, int implemented, int used, int implementationCoverage, int usageCoverage, int modules) {
        this.totalAlgorithms = totalAlgorithms;
        this.implemented = implemented;
        this.used = used;
        this.implementationCoverage = implementationCoverage;
        this.usageCoverage = usageCoverage;
        this.modules = modules;
    }

    public int getTotalAlgorithms() { return totalAlgorithms; }
    public void setTotalAlgorithms(int totalAlgorithms) { this.totalAlgorithms = totalAlgorithms; }

    public int getImplemented() { return implemented; }
    public void setImplemented(int implemented) { this.implemented = implemented; }

    public int getUsed() { return used; }
    public void setUsed(int used) { this.used = used; }

    public int getImplementationCoverage() { return implementationCoverage; }
    public void setImplementationCoverage(int implementationCoverage) { this.implementationCoverage = implementationCoverage; }

    public int getUsageCoverage() { return usageCoverage; }
    public void setUsageCoverage(int usageCoverage) { this.usageCoverage = usageCoverage; }

    public int getModules() { return modules; }
    public void setModules(int modules) { this.modules = modules; }
}
