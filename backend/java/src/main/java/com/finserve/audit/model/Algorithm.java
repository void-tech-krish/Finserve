package com.finserve.audit.model;

public class Algorithm {
    private String id;
    private String name;
    private String moduleId;
    private String status; // IMPLEMENTED & USED, PARTIAL, etc.
    private String fileClass;
    private String usedBy;
    private String purpose;
    private String complexity;
    private String finserveUseCase;
    private String evidence;
    private String vivaNotes;

    public Algorithm() {}

    public Algorithm(String id, String name, String moduleId, String status, String fileClass, String usedBy, String purpose, String complexity, String finserveUseCase, String evidence, String vivaNotes) {
        this.id = id;
        this.name = name;
        this.moduleId = moduleId;
        this.status = status;
        this.fileClass = fileClass;
        this.usedBy = usedBy;
        this.purpose = purpose;
        this.complexity = complexity;
        this.finserveUseCase = finserveUseCase;
        this.evidence = evidence;
        this.vivaNotes = vivaNotes;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFileClass() { return fileClass; }
    public void setFileClass(String fileClass) { this.fileClass = fileClass; }

    public String getUsedBy() { return usedBy; }
    public void setUsedBy(String usedBy) { this.usedBy = usedBy; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getComplexity() { return complexity; }
    public void setComplexity(String complexity) { this.complexity = complexity; }

    public String getFinserveUseCase() { return finserveUseCase; }
    public void setFinserveUseCase(String finserveUseCase) { this.finserveUseCase = finserveUseCase; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public String getVivaNotes() { return vivaNotes; }
    public void setVivaNotes(String vivaNotes) { this.vivaNotes = vivaNotes; }
}
