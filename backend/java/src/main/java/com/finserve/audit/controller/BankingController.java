package com.finserve.audit.controller;

import com.finserve.audit.model.TransactionSearchRequest;
import com.finserve.audit.model.TransactionSearchResponse;
import com.finserve.audit.service.BankingAlgorithmService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/banking")
public class BankingController {

    private final BankingAlgorithmService bankingAlgorithmService;

    public BankingController(BankingAlgorithmService bankingAlgorithmService) {
        this.bankingAlgorithmService = bankingAlgorithmService;
    }

    @PostMapping("/transactions/search")
    public TransactionSearchResponse searchTransaction(@RequestBody TransactionSearchRequest request) {
        return bankingAlgorithmService.searchTransaction(request);
    }

    @PostMapping("/fraud/detect")
    public com.finserve.audit.model.FraudDetectionResponse detectFraud(@RequestBody com.finserve.audit.model.FraudDetectionRequest request) {
        return bankingAlgorithmService.detectFraud(request);
    }

    @PostMapping("/transactions/match")
    public com.finserve.audit.model.TransactionMatchResponse matchTransaction(@RequestBody com.finserve.audit.model.TransactionMatchRequest request) {
        return bankingAlgorithmService.matchTransaction(request);
    }

    @PostMapping("/network/analyze")
    public com.finserve.audit.model.NetworkAnalysisResponse analyzeNetwork(@RequestBody com.finserve.audit.model.NetworkAnalysisRequest request) {
        return bankingAlgorithmService.analyzeNetwork(request);
    }

    @PostMapping("/cases/assign")
    public com.finserve.audit.model.CaseAssignmentResponse assignCases(@RequestBody com.finserve.audit.model.CaseAssignmentRequest request) {
        return bankingAlgorithmService.assignCases(request);
    }

    @PostMapping("/rules/validate")
    public com.finserve.audit.model.BankingRuleResponse validateRules(@RequestBody com.finserve.audit.model.BankingRuleRequest request) {
        return bankingAlgorithmService.validateRules(request);
    }

    @PostMapping("/risk-coverage/analyze")
    public com.finserve.audit.model.RiskCoverageResponse analyzeRiskCoverage(@RequestBody com.finserve.audit.model.RiskCoverageRequest request) {
        return bankingAlgorithmService.analyzeRiskCoverage(request);
    }

    @PostMapping("/transactions/rank")
    public com.finserve.audit.model.TransactionRankingResponse rankTransactions(@RequestBody com.finserve.audit.model.TransactionRankingRequest request) {
        return bankingAlgorithmService.rankTransactions(request);
    }

    @PostMapping("/transactions/sample")
    public com.finserve.audit.model.TransactionSamplingResponse sampleTransactions(@RequestBody com.finserve.audit.model.TransactionSamplingRequest request) {
        return bankingAlgorithmService.sampleTransactions(request);
    }
}
