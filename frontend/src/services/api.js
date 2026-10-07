export const API_BASE = 'http://localhost:8080/api';

// Fallback data in case Java backend is not running
const fallbackData = {
  dashboard: { totalAlgorithms: 30, implemented: 29, used: 29, implementationCoverage: 96, usageCoverage: 96, modules: 6 },
  modules: [
    { id: "M1", name: "String Algorithms", co: "CO1", description: "Algorithms for string processing", totalAlgorithms: 4, implementedCount: 4, usedCount: 4, coveragePercent: 100 },
    { id: "M2", name: "Suffix Structures", co: "CO2", description: "Text indexing", totalAlgorithms: 5, implementedCount: 4, usedCount: 4, coveragePercent: 80 },
    { id: "M3", name: "Advanced Dynamic Programming", co: "CO3", description: "DP for optimization", totalAlgorithms: 5, implementedCount: 5, usedCount: 5, coveragePercent: 100 },
    { id: "M4", name: "Network Flow", co: "CO4", description: "Graph algorithms for flow networks", totalAlgorithms: 5, implementedCount: 5, usedCount: 5, coveragePercent: 100 },
    { id: "M5", name: "NP-Completeness", co: "CO5", description: "Complexity algorithms", totalAlgorithms: 5, implementedCount: 5, usedCount: 5, coveragePercent: 100 },
    { id: "M6", name: "Randomized & Parallel", co: "CO6", description: "Concurrency and randomness", totalAlgorithms: 6, implementedCount: 6, usedCount: 6, coveragePercent: 100 }
  ],
  algorithms: [
    { id: "kmp", name: "KMP", moduleId: "M1", status: "IMPLEMENTED & USED", fileClass: "KMP.java", usedBy: "StringAnalyticsService", purpose: "Substring search", complexity: "O(N)", finserveUseCase: "Pattern matching", evidence: "Genuine implementation", vivaNotes: "" },
    { id: "stree", name: "Suffix Tree", moduleId: "M2", status: "PARTIAL", fileClass: "SuffixTree.java", usedBy: "SuffixAnalyticsService", purpose: "Substring search", complexity: "O(N^2)", finserveUseCase: "Document indexing", evidence: "Educational Trie", vivaNotes: "Do not claim it is compressed." }
  ]
};

export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    return fallbackData.dashboard;
  }
}

export async function fetchModules() {
  try {
    const res = await fetch(`${API_BASE}/modules`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    return fallbackData.modules;
  }
}

export async function fetchAlgorithms() {
  try {
    const res = await fetch(`${API_BASE}/algorithms`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    return fallbackData.algorithms;
  }
}

export async function searchTransaction(transactionText, searchPattern) {
  const res = await fetch(`${API_BASE}/banking/transactions/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionText, searchPattern })
  });
  if (!res.ok) throw new Error('Backend unavailable. Please start the Spring Boot server.');
  return await res.json();
}

export async function detectFraud(transactionText, fraudPatterns) {
  const res = await fetch(`${API_BASE}/banking/fraud/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionText, fraudPatterns })
  });
  if (!res.ok) throw new Error('Unable to connect to the banking analysis service.');
  return await res.json();
}

export async function matchTransaction(transactionA, transactionB, algorithm) {
  const res = await fetch(`${API_BASE}/banking/transactions/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionA, transactionB, algorithm })
  });
  if (!res.ok) throw new Error('Unable to connect to the banking analysis service.');
  return await res.json();
}

export async function analyzeNetwork(payload) {
  const res = await fetch(`${API_BASE}/banking/network/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Unable to connect to the banking network analysis service.');
  return await res.json();
}

export async function assignCases(payload) {
  const res = await fetch(`${API_BASE}/banking/cases/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Unable to connect to the banking case assignment service.');
  return await res.json();
}

export async function validateRules(payload) {
  const res = await fetch(`${API_BASE}/banking/rules/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Unable to connect to the banking rule validation service.');
  return await res.json();
}

export async function analyzeRiskCoverage(payload) {
  const res = await fetch(`${API_BASE}/banking/risk-coverage/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Unable to connect to the banking risk coverage service.');
  return await res.json();
}

export async function rankTransactions(payload) {
  const res = await fetch(`${API_BASE}/banking/transactions/rank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Unable to connect to the banking transaction ranking service.');
  return await res.json();
}

export async function sampleTransactions(payload) {
  const res = await fetch(`${API_BASE}/banking/transactions/sample`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Unable to connect to the banking transaction sampling service.');
  }
  return await res.json();
}
