import React, { useState, useMemo } from 'react';
import { analyzeNetwork } from '../services/api';
import { Network, Activity, Database, Maximize2, Plus, Trash2, ArrowRight, CheckCircle2, AlertCircle, Info, GitCompare } from 'lucide-react';

// Simple SVG Network Visualization Component
const NetworkGraph = ({ nodes, edges, maxFlow, criticalEdges }) => {
  // Simple circle layout
  const width = 600;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const r = 100;
  
  const nodePositions = {};
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    nodePositions[node] = {
      x: cx + r * 1.5 * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  });

  const isCritical = (from, to) => {
    if (!criticalEdges) return false;
    return criticalEdges.some(ce => ce.from === from && ce.to === to);
  };

  return (
    <div className="network-visualization">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
        </defs>
        
        {edges.map((edge, i) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to) return null;
          
          const critical = isCritical(edge.from, edge.to);
          
          return (
            <g key={`edge-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={critical ? "#ef4444" : "#475569"}
                strokeWidth={critical ? 3 : 2}
                markerEnd={`url(#${critical ? 'arrowhead-critical' : 'arrowhead'})`}
                strokeDasharray={critical ? "none" : "5,5"}
              />
              <rect
                x={(from.x + to.x) / 2 - 15}
                y={(from.y + to.y) / 2 - 10}
                width="30"
                height="20"
                fill="#1e293b"
                rx="4"
                stroke={critical ? "#ef4444" : "#475569"}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 + 4}
                fill={critical ? "#f87171" : "#94a3b8"}
                fontSize="12"
                textAnchor="middle"
                fontWeight={critical ? "bold" : "normal"}
              >
                {edge.capacity}
              </text>
            </g>
          );
        })}

        {nodes.map((node, i) => {
          const pos = nodePositions[node];
          return (
            <g key={`node-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill="#0f172a"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y - 25}
                fill="#e2e8f0"
                fontSize="14"
                textAnchor="middle"
                fontWeight="500"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

function TransactionNetwork() {
  const [source, setSource] = useState('');
  const [sink, setSink] = useState('');
  const [algorithm, setAlgorithm] = useState('dinic');
  const [edges, setEdges] = useState([]);
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
      if (e.from) nodes.add(e.from);
      if (e.to) nodes.add(e.to);
    });
    return Array.from(nodes);
  };

  const totalCapacity = edges.reduce((acc, curr) => acc + (parseInt(curr.capacity) || 0), 0);
  const allNodes = extractNodes();

  
  const handleLoadExample = () => {
    setSource('BANK_A'); setSink('BANK_D');
    setEdges([
      { from: 'BANK_A', to: 'BANK_B', capacity: 100 },
      { from: 'BANK_A', to: 'BANK_C', capacity: 80 },
      { from: 'BANK_B', to: 'BANK_C', capacity: 40 },
      { from: 'BANK_B', to: 'BANK_D', capacity: 60 },
      { from: 'BANK_C', to: 'BANK_D', capacity: 100 }
    ]);
  };
  const handleClear = () => { setSource(''); setSink(''); setEdges([]); setResult(null); setComparisonResults(null); setError(null); };
  
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
      setError(err.message || 'Unable to connect to banking analytics service.\nPlease make sure the Spring Boot backend is running.');
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
      setError(err.message || 'Unable to connect to banking analytics service.\nPlease make sure the Spring Boot backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container banking-theme">
      <header className="banking-header">
        <div className="header-content">
          <div>
            <h1>Transaction Network Analysis</h1>
            <p className="subtitle">Analyze transaction capacity and identify bottlenecks across connected financial institutions.</p>
          </div>
          <div className="status-indicator">
            <span className="status-dot pulsing"></span>
            <span className="status-text">Network Analysis Ready</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Database size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Network Nodes</span>
            <span className="kpi-value">{allNodes.length}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Network size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Active Routes</span>
            <span className="kpi-value">{edges.length}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Activity size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Total Capacity</span>
            <span className="kpi-value">₹{totalCapacity}</span>
          </div>
        </div>
        <div className="kpi-card highlight">
          <div className="kpi-icon"><Maximize2 size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Max Flow</span>
            <span className="kpi-value">{result ? `₹${result.maxFlow}` : '--'}</span>
          </div>
        </div>
      </div>

      <div className="content-grid two-columns">
        <div className="main-column">
          <div className="banking-card">
            <div className="card-header">
              <h2>Network Configuration</h2>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Source Institution</label>
                  <div className="input-wrapper">
                    <input type="text" className="banking-input" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. BANK_A" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Destination Institution</label>
                  <div className="input-wrapper">
                    <input type="text" className="banking-input" value={sink} onChange={(e) => setSink(e.target.value)} placeholder="e.g. BANK_D" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Algorithm</label>
                  <div className="input-wrapper">
                    <select className="banking-select" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                      <option value="ford-fulkerson">Ford-Fulkerson</option>
                      <option value="edmonds-karp">Edmonds-Karp</option>
                      <option value="dinic">Dinic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="action-row mt-6">
                
        <button className="btn btn-secondary mr-2" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-tertiary mr-2" onClick={handleClear}>Clear</button>
        <button className="btn btn-primary btn-large mr-2" onClick={handleAnalyze} disabled={loading}>
                  {loading ? (
                    <><span className="spinner"></span> Analyzing...</>
                  ) : (
                    <><Activity size={18} /> Analyze Network</>
                  )}
                </button>
                <button className="btn btn-secondary" onClick={handleCompare} disabled={loading}>
                  <GitCompare size={18} /> Compare Algorithms
                </button>
              </div>
            </div>
          </div>

          <div className="banking-card mt-6">
            <div className="card-header flex-between">
              <h2>Network Routes</h2>
              <button className="btn btn-tertiary btn-sm" onClick={handleAddEdge}>
                <Plus size={16} /> Add Route
              </button>
            </div>
            <div className="card-body p-0">
              {edges.length === 0 ? (
                <div className="empty-state">
                  <Network size={40} className="empty-icon" />
                  <h3>No network routes configured.</h3>
                  <p>Add a route to begin network analysis.</p>
                  <button className="btn btn-tertiary mt-4" onClick={handleAddEdge}>+ Add Route</button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="banking-table">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Capacity (₹)</th>
                        <th>Status</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edges.map((edge, index) => (
                        <tr key={index}>
                          <td>
                            <input type="text" className="banking-input compact" value={edge.from} onChange={(e) => handleEdgeChange(index, 'from', e.target.value)} />
                          </td>
                          <td>
                            <input type="text" className="banking-input compact" value={edge.to} onChange={(e) => handleEdgeChange(index, 'to', e.target.value)} />
                          </td>
                          <td>
                            <input type="number" className="banking-input compact" value={edge.capacity} onChange={(e) => handleEdgeChange(index, 'capacity', e.target.value)} />
                          </td>
                          <td>
                            <span className="badge badge-active">Active</span>
                          </td>
                          <td className="text-right">
                            <button type="button" className="btn-icon btn-danger" onClick={() => handleRemoveEdge(index)} title="Remove Route">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="side-column">
          {error && (
            <div className="alert-card error mb-6">
              <AlertCircle size={20} className="alert-icon" />
              <div className="alert-content">
                <h4>Analysis Error</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="banking-card result-card-animated mb-6">
              <div className="card-header bg-success-subtle">
                <h2 className="flex items-center text-success">
                  <CheckCircle2 size={20} className="mr-2" /> Network Analysis Result
                </h2>
              </div>
              <div className="card-body">
                <div className="result-metric-large">
                  <span className="metric-label">Maximum Flow</span>
                  <span className="metric-value">₹{result.maxFlow}</span>
                </div>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Algorithm</span>
                    <span className="detail-value capitalize">{result.algorithm}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Route</span>
                    <span className="detail-value">{result.source} <ArrowRight size={12} className="inline mx-1" /> {result.sink}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Network Status</span>
                    <span className="badge badge-success">{result.networkStatus || 'Capacity Available'}</span>
                  </div>
                  {result.minCutCapacity !== null && (
                    <div className="detail-row">
                      <span className="detail-label">Minimum Cut</span>
                      <span className="detail-value font-mono">₹{result.minCutCapacity}</span>
                    </div>
                  )}
                </div>

                {result.criticalEdges && result.criticalEdges.length > 0 && (
                  <div className="bottlenecks-section mt-4">
                    <h4 className="text-warning text-sm font-semibold mb-2 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> Bottleneck Routes Identified
                    </h4>
                    <ul className="bottleneck-list">
                      {result.criticalEdges.map((ce, i) => (
                        <li key={i} className="bottleneck-item">
                          <span>{ce.from} → {ce.to}</span>
                          <span className="bottleneck-cap">Cap: {ce.capacity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="banking-card mb-6">
            <div className="card-header">
              <h2>Network Visualization</h2>
            </div>
            <div className="card-body p-0 graph-container">
              {allNodes.length > 0 ? (
                <NetworkGraph 
                  nodes={allNodes} 
                  edges={edges} 
                  maxFlow={result?.maxFlow} 
                  criticalEdges={result?.criticalEdges}
                />
              ) : (
                <div className="empty-graph text-center p-8 text-muted">
                  No nodes to visualize
                </div>
              )}
            </div>
          </div>

          {comparisonResults && (
            <div className="banking-card mb-6 comparison-animated">
              <div className="card-header">
                <h2>Algorithm Comparison</h2>
              </div>
              <div className="card-body p-0">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th className="text-right">Max Flow</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResults.map((res, idx) => (
                      <tr key={idx}>
                        <td className="capitalize font-medium">{res.algorithm.replace('-', ' ')}</td>
                        <td className="text-right font-mono">₹{res.maxFlow}</td>
                        <td className="text-center text-success"><CheckCircle2 size={16} className="inline" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="banking-card info-card bg-primary-subtle border-primary-light">
            <div className="card-body">
              <h3 className="flex items-center text-primary mb-3">
                <Info size={18} className="mr-2" /> Why Network Flow?
              </h3>
              <p className="text-sm text-muted mb-4">
                Network flow algorithms model how transaction capacity moves through connected financial institutions and help identify capacity bottlenecks between source and destination.
              </p>
              <ul className="info-list text-sm">
                <li><span className="bullet"></span> Capacity Monitoring</li>
                <li><span className="bullet"></span> Bottleneck Detection</li>
                <li><span className="bullet"></span> Transaction Routing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionNetwork;
