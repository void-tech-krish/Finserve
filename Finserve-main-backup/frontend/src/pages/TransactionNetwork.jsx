import React, { useState } from 'react';
import { analyzeNetwork } from '../services/api';
import { Network, Activity, Database, Maximize2, Plus, Trash2, ArrowRight, CheckCircle2, AlertCircle, Info, GitCompare } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

const NetworkGraph = ({ nodes, edges, maxFlow, criticalEdges }) => {
  const width = 600;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2;
  const r = 90;
  
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
    <div className="network-visualization my-3">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#7fc4a8" />
          </marker>
          <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#e8836b" />
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
                stroke={critical ? "#e8836b" : "#7fc4a8"}
                strokeWidth={critical ? 3 : 1.5}
                markerEnd={`url(#${critical ? 'arrowhead-critical' : 'arrowhead'})`}
                strokeDasharray={critical ? "none" : "4,4"}
              />
              <rect
                x={(from.x + to.x) / 2 - 15}
                y={(from.y + to.y) / 2 - 10}
                width="30"
                height="18"
                fill="#121319"
                rx="3"
                stroke={critical ? "#e8836b" : "#7fc4a8"}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 + 3}
                fill={critical ? "#e8836b" : "#7fc4a8"}
                fontSize="11"
                fontFamily="JetBrains Mono"
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
                r="16"
                fill="#191b22"
                stroke="#7fc4a8"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y - 22}
                fill="#f6f2ea"
                fontSize="12"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
                fontWeight="600"
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
    if (source) nodes.add(source);
    if (sink) nodes.add(sink);
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

  const handleClear = () => { 
    setSource(''); 
    setSink(''); 
    setEdges([]); 
    setResult(null); 
    setComparisonResults(null); 
    setError(null); 
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
      setError(err.message || 'Unable to connect to banking analytics service.');
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
      setError(err.message || 'Unable to connect to banking analytics service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Network Analytics — Capacity & Flow"
        title="Transaction Network Flow"
        subtitle="Calculate maximum financial transfer capacity and pinpoint bottleneck routes across connected banking institutions."
        meta={
          <>
            <span>ALGORITHMS: DINIC / EDMONDS-KARP / FORD-FULKERSON</span>
            <span>•</span>
            <span>MAX-FLOW MIN-CUT THEOREM</span>
          </>
        }
      />

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Database size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Network Nodes</span>
            <span className="kpi-value"><CountUpNumber end={allNodes.length} /></span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Network size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Active Routes</span>
            <span className="kpi-value"><CountUpNumber end={edges.length} /></span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color: 'var(--clay)' }}><Activity size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Total Capacity</span>
            <span className="kpi-value" style={{ color: 'var(--clay)' }}>₹<CountUpNumber end={totalCapacity} /></span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color: 'var(--focus)' }}><Maximize2 size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Max Flow</span>
            <span className="kpi-value" style={{ color: 'var(--focus)' }}>
              {result ? `₹${result.maxFlow}` : '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Plate
            number={1}
            title="Network Topology Configuration"
            description="Define source bank, destination bank, and route capacities."
            tag="MAX FLOW"
            tagVariant="clay"
            icon={Network}
            watermark="01"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label>Source Bank</label>
                <input type="text" className="form-control" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. BANK_A" />
              </div>
              <div className="form-group">
                <label>Destination Bank</label>
                <input type="text" className="form-control" value={sink} onChange={(e) => setSink(e.target.value)} placeholder="e.g. BANK_D" />
              </div>
              <div className="form-group">
                <label>Algorithm</label>
                <select className="form-control" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                  <option value="ford-fulkerson">Ford-Fulkerson</option>
                  <option value="edmonds-karp">Edmonds-Karp</option>
                  <option value="dinic">Dinic</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Capacity Routes</label>
              <div className="overflow-x-auto mb-3">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Capacity (₹)</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edges.map((edge, index) => (
                      <tr key={index}>
                        <td>
                          <input type="text" className="form-control" value={edge.from} onChange={(e) => handleEdgeChange(index, 'from', e.target.value)} />
                        </td>
                        <td>
                          <input type="text" className="form-control" value={edge.to} onChange={(e) => handleEdgeChange(index, 'to', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-control" value={edge.capacity} onChange={(e) => handleEdgeChange(index, 'capacity', e.target.value)} />
                        </td>
                        <td className="text-right">
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveEdge(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddEdge}>
                + Add Route
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-line">
              <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
              <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Network'}
              </button>
              <button className="btn btn-secondary" onClick={handleCompare} disabled={loading}>
                <GitCompare size={14} /> Compare
              </button>
            </div>
          </Plate>

          <Plate
            number={2}
            title="Network Flow Topology Graph"
            description="Visual graph layout displaying nodes and capacity edges."
            tag="VISUALIZER"
            tagVariant="brass"
            watermark="02"
          >
            {allNodes.length > 0 ? (
              <NetworkGraph 
                nodes={allNodes} 
                edges={edges} 
                maxFlow={result?.maxFlow} 
                criticalEdges={result?.criticalEdges}
              />
            ) : (
              <div className="p-8 text-center font-mono text-xs text-dim">No nodes configured to visualize.</div>
            )}
          </Plate>
        </div>

        <div>
          {error && (
            <div className="alert alert-danger mb-4">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {result && (
            <Plate
              number={3}
              title="Max Flow Results"
              description={`Capacity from ${result.source} to ${result.sink}`}
              tag="ANALYZED"
              tagVariant="brass"
              watermark="03"
            >
              <div className="p-4 bg-ink-3 rounded border border-line mb-4">
                <span className="font-mono text-xs text-dim uppercase block">Maximum Flow Value</span>
                <span className="font-serif text-3xl font-bold text-brass">₹<CountUpNumber end={result.maxFlow} /></span>
              </div>

              {result.criticalEdges && result.criticalEdges.length > 0 && (
                <div className="p-4 bg-ink-3 rounded border border-line">
                  <h4 className="font-mono text-xs uppercase text-sage mb-2">Bottleneck Routes Identified:</h4>
                  <ul className="divide-y divide-line">
                    {result.criticalEdges.map((ce, i) => (
                      <li key={i} className="py-1.5 flex justify-between font-mono text-xs">
                        <span className="text-paper">{ce.from} &rarr; {ce.to}</span>
                        <span className="text-sage font-bold">Cap: {ce.capacity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Plate>
          )}

          {comparisonResults && (
            <Plate
              number={4}
              title="Algorithm Comparison"
              description="Ford-Fulkerson vs Edmonds-Karp vs Dinic"
              tag="BENCHMARK"
              tagVariant="focus"
              watermark="04"
            >
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th className="text-right">Max Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonResults.map((res, idx) => (
                    <tr key={idx}>
                      <td className="text-paper font-semibold capitalize">{res.algorithm}</td>
                      <td className="text-right text-brass">₹{res.maxFlow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Plate>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionNetwork;
