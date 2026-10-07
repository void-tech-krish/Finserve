import React, { useState } from 'react';
import { analyzeNetwork } from '../services/api';

function TransactionNetwork() {
  const [source, setSource] = useState('BANK_A');
  const [sink, setSink] = useState('BANK_D');
  const [algorithm, setAlgorithm] = useState('dinic');
  const [edges, setEdges] = useState([
    { from: 'BANK_A', to: 'BANK_B', capacity: 100 },
    { from: 'BANK_A', to: 'BANK_C', capacity: 80 },
    { from: 'BANK_B', to: 'BANK_C', capacity: 40 },
    { from: 'BANK_B', to: 'BANK_D', capacity: 60 },
    { from: 'BANK_C', to: 'BANK_D', capacity: 100 }
  ]);
  const [result, setResult] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddEdge = () => {
    setEdges([...edges, { from: '', to: '', capacity: 0 }]);
  };

  const handleEdgeChange = (index, field, value) => {
    const newEdges = [...edges];
    newEdges[index][field] = field === 'capacity' ? (parseInt(value) || 0) : value;
    setEdges(newEdges);
  };

  const handleRemoveEdge = (index) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const validateInput = () => {
    if (!source || !sink) return 'Source and Destination are required.';
    if (source === sink) return 'Source and Destination cannot be the same.';
    if (edges.length === 0) return 'At least one edge is required.';
    for (let edge of edges) {
      if (!edge.from || !edge.to) return 'All edges must have from and to nodes.';
      if (edge.capacity < 0) return 'Capacities must be non-negative.';
    }
    return null;
  };

  const extractNodes = () => {
    const nodes = new Set();
    nodes.add(source);
    nodes.add(sink);
    edges.forEach(e => {
      nodes.add(e.from);
      nodes.add(e.to);
    });
    return Array.from(nodes);
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setComparisonResults(null);
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nodes: extractNodes(),
        edges,
        source,
        sink,
        algorithm
      };
      const res = await analyzeNetwork(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    setError(null);
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payloadBase = {
        nodes: extractNodes(),
        edges,
        source,
        sink
      };
      const [ff, ek, dinic] = await Promise.all([
        analyzeNetwork({ ...payloadBase, algorithm: 'ford-fulkerson' }),
        analyzeNetwork({ ...payloadBase, algorithm: 'edmonds-karp' }),
        analyzeNetwork({ ...payloadBase, algorithm: 'dinic' })
      ]);
      setComparisonResults([ff, ek, dinic]);
    } catch (err) {
      setError(err.message || 'Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Transaction Network Analysis</h1>
        <p>Analyze transaction network capacity using maximum flow algorithms.</p>
      </header>

      <div className="content-section">
        <div className="analysis-form">
          <div className="form-group">
            <label>Source Bank</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. BANK_A" />
          </div>
          
          <div className="form-group">
            <label>Destination Bank</label>
            <input type="text" value={sink} onChange={(e) => setSink(e.target.value)} placeholder="e.g. BANK_D" />
          </div>

          <div className="form-group">
            <label>Algorithm</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option value="ford-fulkerson">Ford-Fulkerson</option>
              <option value="edmonds-karp">Edmonds-Karp</option>
              <option value="dinic">Dinic</option>
            </select>
          </div>

          <div className="form-group">
            <label>Network Edges</label>
            <table className="edges-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((edge, index) => (
                  <tr key={index}>
                    <td><input type="text" value={edge.from} onChange={(e) => handleEdgeChange(index, 'from', e.target.value)} /></td>
                    <td><input type="text" value={edge.to} onChange={(e) => handleEdgeChange(index, 'to', e.target.value)} /></td>
                    <td><input type="number" value={edge.capacity} onChange={(e) => handleEdgeChange(index, 'capacity', e.target.value)} /></td>
                    <td><button type="button" className="btn btn-secondary" onClick={() => handleRemoveEdge(index)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-secondary mt-2" onClick={handleAddEdge}>+ Add Edge</button>
          </div>

          <div className="form-actions mt-4">
            <button className="btn btn-primary mr-2" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Transaction Network'}
            </button>
            <button className="btn btn-secondary" onClick={handleCompare} disabled={loading}>
              Compare Algorithms
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Transaction Network Analysis Results</h2>
            <div className="result-card">
              <p><strong>Source:</strong> {result.source}</p>
              <p><strong>Destination:</strong> {result.sink}</p>
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Maximum Transaction Flow:</strong> {result.maxFlow}</p>
              {result.minCutCapacity !== null && (
                <p><strong>Minimum Cut:</strong> {result.minCutCapacity}</p>
              )}
              <p><strong>Network Status:</strong> {result.networkStatus}</p>
              
              {result.criticalEdges && result.criticalEdges.length > 0 && (
                <div className="mt-2">
                  <strong>Critical Edges (Bottlenecks):</strong>
                  <ul>
                    {result.criticalEdges.map((ce, i) => (
                      <li key={i}>{ce.from} → {ce.to} (Capacity: {ce.capacity})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {comparisonResults && (
          <div className="results-panel mt-4">
            <h2>Algorithm Comparison</h2>
            <table className="comparison-table w-full">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Maximum Flow</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResults.map((res, idx) => (
                  <tr key={idx}>
                    <td>{res.algorithm}</td>
                    <td>{res.maxFlow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="info-panel mt-4">
          <h2>Why Network Flow?</h2>
          <p>
            Network flow algorithms can model how transaction capacity moves through
            a network of financial institutions and help identify capacity
            bottlenecks between a source and destination.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionNetwork;
