package com.finserve.audit.controller;

import com.finserve.audit.model.*;
import com.finserve.audit.service.BankingAlgorithmService;
import com.finserve.audit.service.CsvStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/banking")
public class BankingController {

    private final BankingAlgorithmService bankingAlgorithmService;
    private final CsvStorageService csvStorageService;

    private static final List<String> ALLOWED_FEATURES = Arrays.asList(
        "transaction-intelligence", "fraud-detection", "transaction-matching", 
        "transaction-network", "case-assignment", "rule-validation", 
        "risk-coverage", "transaction-ranking", "transaction-sampling"
    );

    public BankingController(BankingAlgorithmService bankingAlgorithmService, CsvStorageService csvStorageService) {
        this.bankingAlgorithmService = bankingAlgorithmService;
        this.csvStorageService = csvStorageService;
    }

    @PostMapping("/transactions/search")
    public TransactionSearchResponse searchTransaction(@RequestBody TransactionSearchRequest request) {
        TransactionSearchResponse response = bankingAlgorithmService.searchTransaction(request);
        csvStorageService.saveTransactionSearch(request);
        return response;
    }

    @PostMapping("/fraud/detect")
    public FraudDetectionResponse detectFraud(@RequestBody FraudDetectionRequest request) {
        FraudDetectionResponse response = bankingAlgorithmService.detectFraud(request);
        csvStorageService.saveFraudDetection(request, response);
        return response;
    }

    @PostMapping("/transactions/match")
    public TransactionMatchResponse matchTransaction(@RequestBody TransactionMatchRequest request) {
        TransactionMatchResponse response = bankingAlgorithmService.matchTransaction(request);
        csvStorageService.saveTransactionMatch(request, response);
        return response;
    }

    @PostMapping("/network/analyze")
    public NetworkAnalysisResponse analyzeNetwork(@RequestBody NetworkAnalysisRequest request) {
        NetworkAnalysisResponse response = bankingAlgorithmService.analyzeNetwork(request);
        csvStorageService.saveNetworkAnalysis(request);
        return response;
    }

    @PostMapping("/cases/assign")
    public CaseAssignmentResponse assignCases(@RequestBody CaseAssignmentRequest request) {
        CaseAssignmentResponse response = bankingAlgorithmService.assignCases(request);
        csvStorageService.saveCaseAssignment(request);
        return response;
    }

    @PostMapping("/rules/validate")
    public BankingRuleResponse validateRules(@RequestBody BankingRuleRequest request) {
        BankingRuleResponse response = bankingAlgorithmService.validateRules(request);
        csvStorageService.saveRuleValidation(request, response);
        return response;
    }

    @PostMapping("/risk-coverage/analyze")
    public RiskCoverageResponse analyzeRiskCoverage(@RequestBody RiskCoverageRequest request) {
        RiskCoverageResponse response = bankingAlgorithmService.analyzeRiskCoverage(request);
        csvStorageService.saveRiskCoverage(request, response);
        return response;
    }

    @PostMapping("/transactions/rank")
    public TransactionRankingResponse rankTransactions(@RequestBody TransactionRankingRequest request) {
        TransactionRankingResponse response = bankingAlgorithmService.rankTransactions(request);
        csvStorageService.saveTransactionRanking(request);
        return response;
    }

    @PostMapping("/transactions/sample")
    public TransactionSamplingResponse sampleTransactions(@RequestBody TransactionSamplingRequest request) {
        TransactionSamplingResponse response = bankingAlgorithmService.sampleTransactions(request);
        csvStorageService.saveTransactionSampling(request, response);
        return response;
    }

    @GetMapping("/storage/{feature}")
    public ResponseEntity<List<String>> getStoredData(@PathVariable String feature) {
        if (!ALLOWED_FEATURES.contains(feature)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(csvStorageService.getStoredData(feature));
    }
}
