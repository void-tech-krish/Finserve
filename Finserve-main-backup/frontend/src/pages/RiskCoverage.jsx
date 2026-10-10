import React, { useState } from 'react';
import { analyzeRiskCoverage } from '../services/api';
import { Crosshair, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

function RiskCoverage() {
  const [nodesInput, setNodesInput] = useState('');
  const [riskyEdges, setRiskyEdges] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddEdge = () => {
    setRiskyEdges([...riskyEdges, { from: '', to: '' }]);
  };

  const handleEdgeChange = (index, field, value) => {
    const newEdges = [...riskyEdges];
    newEdges[index][field] = value;
    setRiskyEdges(newEdges);
  };

  const handleRemoveEdge = (index) => {
    setRiskyEdges(riskyEdges.filter((_, i) => i !== index));
  };

  const parseNodes = (text) => text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const handleLoadExample = () => {
    setNodesInput('BANK_A\nBANK_B\nBANK_C\nBANK_D\nBANK_E');
    setRiskyEdges([
      { from: 'BANK_A', to: 'BANK_B' }, 
      { from: 'BANK_A', to: 'BANK_C' }, 
      { from: 'BANK_B', to: 'BANK_D' }, 
      { from: 'BANK_C', to: 'BANK_D' }, 
      { from: 'BANK_D', to: 'BANK_E' }
    ]);
  };

  const handleClear = () => { 
    setNodesInput(''); 
    setRiskyEdges([]); 
    setResult(null); 
    setError(null); 
  };
  
  const handleAnalyze = async () => {
    setError(null);
    setResult(null);

    const nodes = parseNodes(nodesInput);

    if (nodes.length === 0) {
      setError('Please provide at least one banking entity.');
      return;
    }

    const validEdges = riskyEdges.filter(e => e.from && e.to);
    
    for (let el of validEdges) {
      if (!nodes.includes(el.from)) {
        setError(`Unknown entity in edge: ${el.from}`);
        return;
      }
      if (!nodes.includes(el.to)) {
        setError(`Unknown entity in edge: ${el.to}`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        nodes,
        riskyEdges: validEdges
      };
      const res = await analyzeRiskCoverage(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Fraud & Risk — Coverage"
        title="Banking Risk Coverage"
        subtitle="Identify a minimum set of critical banking entities/channels that covers all risky relationships using Vertex Cover 2-Approximation."
        meta={
          <>
            <span>ALGORITHM: VERTEX COVER 2-APPROXIMATION</span>
            <span>•</span>
            <span>APPROXIMATION RATIO: &le; 2.0</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Banking Entities & Risky Channels"
        description="Enter banking node identifiers and edge connections to analyze risk coverage."
        tag="2-APPROXIMATION"
        tagVariant="sage"
        icon={Crosshair}
        watermark="01"
      >
        <div className="form-group mb-4">
          <label>Banking Entities (One per line)</label>
          <textarea 
            className="form-control banking-textarea"
            style={{ minHeight: '100px' }}
            value={nodesInput} 
            onChange={(e) => setNodesInput(e.target.value)} 
            placeholder="BANK_A&#10;BANK_B" 
          />
        </div>

        <div className="form-group">
          <label>Risky Channel Connections</label>
          <div className="overflow-x-auto mb-3">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Entity 1</th>
                  <th>Entity 2</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {riskyEdges.map((edge, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="text" 
                        className="form-control"
                        value={edge.from} 
                        onChange={(e) => handleEdgeChange(index, 'from', e.target.value)} 
                        placeholder="e.g. BANK_A" 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control"
                        value={edge.to} 
                        onChange={(e) => handleEdgeChange(index, 'to', e.target.value)} 
                        placeholder="e.g. BANK_B" 
                      />
                    </td>
                    <td className="text-right">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveEdge(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {riskyEdges.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center font-mono text-xs text-dim py-6">
                      No channel connections added. Click "Load Example" or "+ Add Risky Relationship".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="my-5 py-2">
            <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddEdge}>
              + Add Risky Relationship
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-line">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Risk Coverage'}
          </button>
        </div>
      </Plate>

      {error && (
        <div className="alert alert-danger mt-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {result && (
        <Plate
          number={2}
          title="Critical Monitoring Set Analysis"
          description="Covered channels telemetry."
          tag="VERTEX COVER"
          tagVariant="sage"
          watermark="02"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Total Relationships</span>
              <span className="font-mono text-lg text-paper font-bold"><CountUpNumber end={result.riskyEdges} /></span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Covered Relationships</span>
              <span className="font-mono text-lg text-brass font-bold"><CountUpNumber end={result.coveredEdges} /></span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Coverage Ratio</span>
              <span className="font-mono text-lg text-clay font-bold"><CountUpNumber end={result.coveragePercentage} />%</span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Cover Valid</span>
              <span className="font-mono text-lg text-focus font-bold">{result.validVertexCover ? 'YES' : 'NO'}</span>
            </div>
          </div>

          <div className="p-4 bg-ink-3 rounded border border-line">
            <h4 className="font-mono text-xs uppercase text-brass mb-3">Selected Critical Monitoring Entities:</h4>
            <div className="flex flex-wrap gap-2">
              {result.selectedEntities && result.selectedEntities.map((entity, i) => (
                <span key={i} className="badge badge-success font-mono text-sm px-3 py-1">{entity}</span>
              ))}
              {(!result.selectedEntities || result.selectedEntities.length === 0) && (
                <span className="font-mono text-xs text-dim">No entities selected.</span>
              )}
            </div>
          </div>
        </Plate>
      )}

      <Plate
        number={3}
        title="Why Vertex Cover Approximation?"
        description="NP-Complete polynomial time 2-approximation algorithm for risk coverage."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          Selected entities represent a monitoring set that covers every risky relationship in the network using a polynomial-time 2-approximation algorithm that guarantees a cover size at most twice the optimal minimum.
        </p>
      </Plate>
    </div>
  );
}

export default RiskCoverage;
