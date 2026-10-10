package com.finserve.audit.service;

import com.finserve.audit.model.*;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class CsvStorageService {

    private static final String CSV_DIR = "data/csv/";
    private final AtomicLong recordCounter = new AtomicLong(1);
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(CSV_DIR);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            System.err.println("Failed to create CSV directory: " + e.getMessage());
        }
    }

    private synchronized String generateRecordId() {
        return String.format("REC-%06d", recordCounter.getAndIncrement());
    }

    private String getTimestamp() {
        return LocalDateTime.now().format(formatter);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        String escaped = value;
        // Prevent formula injection
        if (escaped.startsWith("=") || escaped.startsWith("+") || escaped.startsWith("-") || escaped.startsWith("@")) {
            escaped = "'" + escaped;
        }
        if (escaped.contains("\"") || escaped.contains(",") || escaped.contains("\n") || escaped.contains("\r")) {
            escaped = escaped.replace("\"", "\"\"");
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    private synchronized void writeLine(String filename, String header, String line) {
        try {
            File file = new File(CSV_DIR + filename);
            boolean isNew = !file.exists() || file.length() == 0;
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                if (isNew) {
                    writer.write(header);
                    writer.newLine();
                }
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Failed to write to CSV " + filename + ": " + e.getMessage());
        }
    }

    public void saveTransactionSearch(TransactionSearchRequest request) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,transaction_text,search_pattern";
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(request.getTransactionText()), 
            escapeCsv(request.getSearchPattern())
        );
        writeLine("transaction_intelligence.csv", header, line);
    }

    public void saveFraudDetection(FraudDetectionRequest request, FraudDetectionResponse response) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,transaction_description,fraud_patterns,match_count";
        String patternsStr = request.getFraudPatterns() != null ? String.join("\n", request.getFraudPatterns()) : "";
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(request.getTransactionText()), 
            escapeCsv(patternsStr),
            String.valueOf(response.getMatchCount())
        );
        writeLine("fraud_detection.csv", header, line);
    }

    public void saveTransactionMatch(TransactionMatchRequest request, TransactionMatchResponse response) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,transaction_a,transaction_b,algorithm,distance";
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(request.getTransactionA()), 
            escapeCsv(request.getTransactionB()),
            escapeCsv(request.getAlgorithm()),
            String.valueOf(response.getDistance())
        );
        writeLine("transaction_matching.csv", header, line);
    }

    public void saveNetworkAnalysis(NetworkAnalysisRequest request) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,source,destination,capacity";
        if (request.getEdges() != null) {
            for (NetworkAnalysisRequest.EdgeRequest edge : request.getEdges()) {
                String line = String.join(",", 
                    recordId, 
                    timestamp, 
                    escapeCsv(edge.getFrom()), 
                    escapeCsv(edge.getTo()),
                    String.valueOf(edge.getCapacity())
                );
                writeLine("transaction_network_edges.csv", header, line);
            }
        }
    }

    public void saveCaseAssignment(CaseAssignmentRequest request) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,cases,analysts,eligibility";
        String cases = request.getCases() != null ? String.join(";", request.getCases()) : "";
        String analysts = request.getAnalysts() != null ? String.join(";", request.getAnalysts()) : "";
        String eligibility = "";
        if (request.getEligibility() != null) {
            eligibility = request.getEligibility().stream()
                .map(e -> e.getCaseId() + "->" + e.getAnalystId())
                .collect(Collectors.joining(";"));
        }
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(cases), 
            escapeCsv(analysts),
            escapeCsv(eligibility)
        );
        writeLine("case_assignment.csv", header, line);
    }

    public void saveRuleValidation(BankingRuleRequest request, BankingRuleResponse response) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,variables,clauses,validation_result";
        String vars = request.getVariables() != null ? String.join(";", request.getVariables()) : "";
        String clauses = "";
        if (request.getClauses() != null) {
            clauses = request.getClauses().stream()
                .map(c -> String.join(" OR ", c))
                .collect(Collectors.joining(" AND "));
        }
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(vars), 
            escapeCsv(clauses),
            String.valueOf(response.isSatisfiable())
        );
        writeLine("rule_validation.csv", header, line);
    }

    public void saveRiskCoverage(RiskCoverageRequest request, RiskCoverageResponse response) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,entities,risk_relationships,coverage_result";
        String entities = request.getNodes() != null ? String.join(";", request.getNodes()) : "";
        String edges = "";
        if (request.getRiskyEdges() != null) {
            edges = request.getRiskyEdges().stream()
                .map(e -> e.getFrom() + "-" + e.getTo())
                .collect(Collectors.joining(";"));
        }
        String line = String.join(",", 
            recordId, 
            timestamp, 
            escapeCsv(entities), 
            escapeCsv(edges),
            String.valueOf(response.getCoveragePercentage())
        );
        writeLine("risk_coverage.csv", header, line);
    }

    public void saveTransactionRanking(TransactionRankingRequest request) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,transaction_id,amount,merchant";
        if (request.getTransactions() != null) {
            for (TransactionRankingRequest.TransactionInput tx : request.getTransactions()) {
                String line = String.join(",", 
                    recordId, 
                    timestamp, 
                    escapeCsv(tx.getTransactionId()), 
                    String.valueOf(tx.getAmount()),
                    ""
                );
                writeLine("transaction_ranking.csv", header, line);
            }
        }
    }

    public void saveTransactionSampling(TransactionSamplingRequest request, TransactionSamplingResponse response) {
        String recordId = generateRecordId();
        String timestamp = getTimestamp();
        String header = "record_id,timestamp,transaction_id,amount,merchant,sample_size,selected";
        if (request.getTransactions() != null) {
            List<String> sampledIds = response.getSampledTransactions() != null ? 
                response.getSampledTransactions().stream().map(TransactionRecord::getTransactionId).collect(Collectors.toList()) : 
                java.util.Collections.emptyList();

            for (TransactionRecord tx : request.getTransactions()) {
                boolean selected = sampledIds.contains(tx.getTransactionId());
                String line = String.join(",", 
                    recordId, 
                    timestamp, 
                    escapeCsv(tx.getTransactionId()), 
                    escapeCsv(String.valueOf(tx.getAmount())),
                    escapeCsv(tx.getMerchant()),
                    String.valueOf(request.getSampleSize()),
                    String.valueOf(selected)
                );
                writeLine("transaction_sampling.csv", header, line);
            }
        }
    }

    public synchronized List<String> getStoredData(String feature) {
        try {
            String filename = feature.replace("-", "_") + (feature.equals("transaction-network") ? "_edges.csv" : ".csv");
            Path path = Paths.get(CSV_DIR, filename);
            if (Files.exists(path)) {
                return Files.readAllLines(path);
            }
        } catch (IOException e) {
            System.err.println("Failed to read CSV: " + e.getMessage());
        }
        return java.util.Collections.emptyList();
    }
}
