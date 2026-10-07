package com.finserve.audit.service;

import com.finserve.audit.model.TransactionSearchRequest;
import com.finserve.audit.model.TransactionSearchResponse;
import com.finserve.audit.model.FraudDetectionRequest;
import com.finserve.audit.model.FraudDetectionResponse;
import com.finserve.audit.model.TransactionMatchRequest;
import com.finserve.audit.model.TransactionMatchResponse;
import com.finserve.module1.algorithms.KMP;
import com.finserve.module1.algorithms.AhoCorasick;
import com.finserve.module3.algorithms.LevenshteinDistance;
import com.finserve.module3.algorithms.DamerauLevenshtein;
import com.finserve.audit.model.NetworkAnalysisRequest;
import com.finserve.audit.model.NetworkAnalysisResponse;
import com.finserve.audit.model.CaseAssignmentRequest;
import com.finserve.audit.model.CaseAssignmentResponse;
import com.finserve.audit.model.BankingRuleRequest;
import com.finserve.audit.model.BankingRuleResponse;
import com.finserve.audit.model.RiskCoverageRequest;
import com.finserve.audit.model.RiskCoverageResponse;
import com.finserve.audit.model.TransactionRankingRequest;
import com.finserve.audit.model.TransactionRankingResponse;
import com.finserve.audit.model.TransactionSamplingRequest;
import com.finserve.audit.model.TransactionSamplingResponse;
import com.finserve.audit.model.TransactionRecord;
import com.finserve.module4.algorithms.FordFulkerson;
import com.finserve.module4.algorithms.EdmondsKarp;
import com.finserve.module4.algorithms.Dinic;
import com.finserve.module4.algorithms.MinCut;
import com.finserve.module4.algorithms.BipartiteMatching;
import com.finserve.module5.algorithms.ThreeSAT;
import com.finserve.module5.algorithms.VertexCoverApproximation;
import com.finserve.module5.algorithms.IndependentSetVertexCover;
import com.finserve.module6.algorithms.RandomizedQuickSort;
import com.finserve.module6.algorithms.ReservoirSampling;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

@Service
public class BankingAlgorithmService {

    public TransactionSearchResponse searchTransaction(TransactionSearchRequest request) {
        String text = request.getTransactionText();
        String pattern = request.getSearchPattern();
        
        if (text == null || pattern == null || pattern.isEmpty()) {
            return new TransactionSearchResponse(false, pattern, -1, "KMP", "O(n + m)");
        }

        List<Integer> matches = KMP.search(text, pattern);
        
        if (matches != null && !matches.isEmpty()) {
            return new TransactionSearchResponse(true, pattern, matches.get(0), "KMP", "O(n + m)");
        }
        
        return new TransactionSearchResponse(false, pattern, -1, "KMP", "O(n + m)");
    }

    public FraudDetectionResponse detectFraud(FraudDetectionRequest request) {
        String text = request.getTransactionText();
        List<String> patterns = request.getFraudPatterns();

        if (text == null || patterns == null || patterns.isEmpty()) {
            return new FraudDetectionResponse(false, new ArrayList<>(), 0, "Aho-Corasick", "O(n + m + z)");
        }

        AhoCorasick ac = new AhoCorasick();
        for (String pattern : patterns) {
            ac.addPattern(pattern);
        }
        ac.buildFailureLinks();

        Map<String, List<Integer>> matches = ac.search(text);
        List<FraudDetectionResponse.MatchedPattern> matchedList = new ArrayList<>();
        int matchCount = 0;

        for (Map.Entry<String, List<Integer>> entry : matches.entrySet()) {
            for (Integer pos : entry.getValue()) {
                matchedList.add(new FraudDetectionResponse.MatchedPattern(entry.getKey(), pos));
                matchCount++;
            }
        }

        boolean found = matchCount > 0;
        return new FraudDetectionResponse(found, matchedList, matchCount, "Aho-Corasick", "O(n + m + z)");
    }

    public TransactionMatchResponse matchTransaction(TransactionMatchRequest request) {
        String txA = request.getTransactionA() != null ? request.getTransactionA() : "";
        String txB = request.getTransactionB() != null ? request.getTransactionB() : "";
        String algo = request.getAlgorithm() != null ? request.getAlgorithm() : "Levenshtein";

        int distance = 0;
        String algorithmUsed = "Levenshtein";

        if ("damerau-levenshtein".equalsIgnoreCase(algo)) {
            distance = DamerauLevenshtein.calculate(txA, txB);
            algorithmUsed = "Damerau-Levenshtein";
        } else {
            distance = LevenshteinDistance.calculate(txA, txB);
        }

        boolean matched = distance <= 2;
        return new TransactionMatchResponse(txA, txB, algorithmUsed, distance, matched);
    }

    public NetworkAnalysisResponse analyzeNetwork(NetworkAnalysisRequest request) {
        List<String> nodes = request.getNodes();
        if (nodes == null || nodes.isEmpty()) {
            throw new IllegalArgumentException("Nodes list cannot be empty");
        }

        int n = nodes.size();
        int[][] capacity = new int[n][n];

        if (request.getEdges() != null) {
            for (NetworkAnalysisRequest.EdgeRequest edge : request.getEdges()) {
                int u = nodes.indexOf(edge.getFrom());
                int v = nodes.indexOf(edge.getTo());
                if (u != -1 && v != -1 && edge.getCapacity() > 0) {
                    capacity[u][v] += edge.getCapacity(); // allow duplicate edges to add up or just take last, network flows usually add up
                }
            }
        }

        int source = nodes.indexOf(request.getSource());
        int sink = nodes.indexOf(request.getSink());

        if (source == -1 || sink == -1) {
            throw new IllegalArgumentException("Invalid source or sink");
        }

        if (source == sink) {
            throw new IllegalArgumentException("Source and sink cannot be the same");
        }

        String algo = request.getAlgorithm() != null ? request.getAlgorithm().toLowerCase() : "dinic";
        int maxFlow = 0;
        String algorithmUsed = "Dinic";

        switch (algo) {
            case "ford-fulkerson":
                maxFlow = FordFulkerson.maxFlow(capacity, source, sink);
                algorithmUsed = "Ford-Fulkerson";
                break;
            case "edmonds-karp":
                maxFlow = EdmondsKarp.maxFlow(capacity, source, sink);
                algorithmUsed = "Edmonds-Karp";
                break;
            case "dinic":
            default:
                maxFlow = Dinic.maxFlow(capacity, source, sink);
                algorithmUsed = "Dinic";
                break;
        }

        MinCut.MinCutResult minCutResult = MinCut.findMinCut(capacity, source, sink);
        
        List<NetworkAnalysisResponse.CriticalEdge> criticalEdges = new ArrayList<>();
        if (minCutResult != null && minCutResult.cutEdges != null) {
            for (String edgeStr : minCutResult.cutEdges) {
                String[] parts = edgeStr.split(" -> ");
                if (parts.length == 2) {
                    int u = Integer.parseInt(parts[0]);
                    int v = Integer.parseInt(parts[1]);
                    criticalEdges.add(new NetworkAnalysisResponse.CriticalEdge(nodes.get(u), nodes.get(v), capacity[u][v]));
                }
            }
        }

        String networkStatus = maxFlow > 0 ? "Bottleneck Detected (Min-Cut defines the network constraint)" : "No Path Available";
        Integer minCutCapacity = minCutResult != null ? minCutResult.maxFlow : null;

        return new NetworkAnalysisResponse(
                request.getSource(),
                request.getSink(),
                algorithmUsed,
                maxFlow,
                minCutCapacity,
                criticalEdges,
                networkStatus
        );
    }

    public CaseAssignmentResponse assignCases(CaseAssignmentRequest request) {
        List<String> cases = request.getCases();
        List<String> analysts = request.getAnalysts();
        
        if (cases == null || analysts == null) {
            return new CaseAssignmentResponse("Bipartite Matching", cases == null ? 0 : cases.size(), analysts == null ? 0 : analysts.size(), 0, new ArrayList<>(), cases == null ? new ArrayList<>() : cases);
        }

        int leftNodes = cases.size();
        int rightNodes = analysts.size();
        boolean[][] adjMatrix = new boolean[leftNodes][rightNodes];

        if (request.getEligibility() != null) {
            for (CaseAssignmentRequest.Eligibility eligibility : request.getEligibility()) {
                int u = cases.indexOf(eligibility.getCaseId());
                int v = analysts.indexOf(eligibility.getAnalystId());
                if (u != -1 && v != -1) {
                    adjMatrix[u][v] = true;
                }
            }
        }

        BipartiteMatching.MatchingResult result = BipartiteMatching.maxMatching(adjMatrix);
        
        List<CaseAssignmentResponse.Assignment> assignments = new ArrayList<>();
        List<String> unassignedCases = new ArrayList<>(cases);

        for (int v = 0; v < rightNodes; v++) {
            if (result.assignedTo[v] != -1) {
                int u = result.assignedTo[v];
                assignments.add(new CaseAssignmentResponse.Assignment(cases.get(u), analysts.get(v)));
                unassignedCases.remove(cases.get(u));
            }
        }

        return new CaseAssignmentResponse(
                "Bipartite Matching",
                leftNodes,
                rightNodes,
                result.maxMatching,
                assignments,
                unassignedCases
        );
    }

    public BankingRuleResponse validateRules(BankingRuleRequest request) {
        List<String> variables = request.getVariables();
        List<List<String>> inputClauses = request.getClauses();
        
        if (variables == null || variables.isEmpty()) {
            throw new IllegalArgumentException("Variable list cannot be empty");
        }
        if (inputClauses == null || inputClauses.isEmpty()) {
            throw new IllegalArgumentException("Clause list cannot be empty");
        }

        int numVariables = variables.size();
        List<int[]> clauses = new ArrayList<>();

        for (List<String> inputClause : inputClauses) {
            if (inputClause == null || inputClause.size() != 3) {
                throw new IllegalArgumentException("Each clause must contain exactly 3 literals.");
            }
            int[] clause = new int[3];
            for (int i = 0; i < 3; i++) {
                String literalStr = inputClause.get(i).trim();
                boolean isNegated = literalStr.startsWith("!");
                String varName = isNegated ? literalStr.substring(1) : literalStr;
                
                int varIndex = variables.indexOf(varName);
                if (varIndex == -1) {
                    throw new IllegalArgumentException("Unknown variable: " + varName);
                }
                // Variables in ThreeSAT are 1-indexed
                int satLiteral = varIndex + 1;
                if (isNegated) {
                    satLiteral = -satLiteral;
                }
                clause[i] = satLiteral;
            }
            clauses.add(clause);
        }

        ThreeSAT.SATResult result = ThreeSAT.solve(numVariables, clauses);
        Map<String, Boolean> assignmentMap = null;

        if (result.satisfiable && result.assignment != null) {
            assignmentMap = new HashMap<>();
            for (int i = 0; i < numVariables; i++) {
                // assignment array is 1-indexed
                assignmentMap.put(variables.get(i), result.assignment[i + 1]);
            }
        }

        return new BankingRuleResponse(
                result.satisfiable,
                "3-SAT",
                numVariables,
                inputClauses.size(),
                assignmentMap
        );
    }

    public RiskCoverageResponse analyzeRiskCoverage(RiskCoverageRequest request) {
        List<String> nodes = request.getNodes();
        if (nodes == null || nodes.isEmpty()) {
            return new RiskCoverageResponse("Vertex Cover Approximation", 0, 0, new ArrayList<>(), 0, 100, true, null, null, null);
        }

        int n = nodes.size();
        boolean[][] graph = new boolean[n][n];
        int numEdges = 0;

        if (request.getRiskyEdges() != null) {
            for (RiskCoverageRequest.Edge edge : request.getRiskyEdges()) {
                int u = nodes.indexOf(edge.getFrom());
                int v = nodes.indexOf(edge.getTo());
                if (u != -1 && v != -1 && u != v) {
                    if (!graph[u][v]) {
                        graph[u][v] = true;
                        graph[v][u] = true;
                        numEdges++;
                    }
                }
            }
        }

        if (numEdges == 0) {
            return new RiskCoverageResponse("Vertex Cover Approximation", n, 0, new ArrayList<>(), 0, 100, true, 0, 0, 1.0);
        }

        List<Integer> approximateCover = VertexCoverApproximation.approximateVertexCover(graph);
        
        List<String> selectedEntities = new ArrayList<>();
        for (int v : approximateCover) {
            selectedEntities.add(nodes.get(v));
        }

        boolean isValid = IndependentSetVertexCover.isVertexCover(graph, approximateCover);

        int coveredEdges = isValid ? numEdges : 0; // simplistic check, if valid it covers all.
        if (!isValid) {
            // Count actual covered edges just in case
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (graph[i][j]) {
                        if (approximateCover.contains(i) || approximateCover.contains(j)) {
                            coveredEdges++;
                        }
                    }
                }
            }
        }
        
        int coveragePercentage = numEdges == 0 ? 100 : (int) Math.round((coveredEdges * 100.0) / numEdges);

        Integer exactCoverSize = null;
        Integer approximateCoverSize = approximateCover.size();
        Double approximationRatio = null;

        if (n <= 20) { // arbitrary small graph limit to avoid timeout
            exactCoverSize = VertexCoverApproximation.getExactMinimumVertexCoverSize(graph);
            if (exactCoverSize > 0) {
                approximationRatio = (double) approximateCoverSize / exactCoverSize;
            }
        }

        return new RiskCoverageResponse(
                "Vertex Cover Approximation",
                n,
                numEdges,
                selectedEntities,
                coveredEdges,
                coveragePercentage,
                isValid,
                exactCoverSize,
                approximateCoverSize,
                approximationRatio
        );
    }

    public TransactionRankingResponse rankTransactions(TransactionRankingRequest request) {
        List<TransactionRankingRequest.TransactionInput> transactions = request.getTransactions();
        if (transactions == null || transactions.isEmpty()) {
            return new TransactionRankingResponse("Randomized QuickSort", "DESCENDING", new ArrayList<>());
        }

        int n = transactions.size();
        long[] amounts = new long[n];
        Map<Long, Queue<String>> idMap = new HashMap<>();

        for (int i = 0; i < n; i++) {
            long amt = transactions.get(i).getAmount();
            amounts[i] = amt;
            idMap.computeIfAbsent(amt, k -> new LinkedList<>()).add(transactions.get(i).getTransactionId());
        }

        // Use a fixed seed for reproducible tests, or null for real randomness. Here we'll use null.
        RandomizedQuickSort.sort(amounts, null);

        List<TransactionRankingResponse.RankedTransaction> rankedList = new ArrayList<>();
        int rank = 1;

        // Since RandomizedQuickSort sorts in ascending order, we iterate backwards to get DESCENDING order
        for (int i = n - 1; i >= 0; i--) {
            long amt = amounts[i];
            String id = idMap.get(amt).poll(); // Retrieve and remove one transaction ID for this amount
            rankedList.add(new TransactionRankingResponse.RankedTransaction(rank++, id, amt));
        }

        return new TransactionRankingResponse("Randomized QuickSort", "DESCENDING", rankedList);
    }

    public TransactionSamplingResponse sampleTransactions(TransactionSamplingRequest request) {
        List<TransactionRecord> transactions = request.getTransactions();
        int sampleSize = request.getSampleSize();

        if (transactions == null || transactions.isEmpty()) {
            throw new IllegalArgumentException("Transaction list cannot be empty");
        }

        if (sampleSize <= 0) {
            throw new IllegalArgumentException("Sample size must be strictly greater than 0");
        }

        if (sampleSize > transactions.size()) {
            throw new IllegalArgumentException("Sample size cannot exceed total number of transactions");
        }

        // Use ReservoirSampling with null seed for real randomness in production usage
        // Tests can mock/pass fixed seed if extending the API, but for now we rely on the internal Math.random wrapper
        List<TransactionRecord> sampled = ReservoirSampling.sample(transactions, sampleSize, null);

        return new TransactionSamplingResponse(transactions.size(), sampleSize, sampled);
    }
}
