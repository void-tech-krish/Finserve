import React, { useState } from 'react';
import { analyzeRiskCoverage } from '../services/api';

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
    setRiskyEdges([{ from: 'BANK_A', to: 'BANK_B' }, { from: 'BANK_A', to: 'BANK_C' }, { from: 'BANK_B', to: 'BANK_D' }, { from: 'BANK_C', to: 'BANK_D' }, { from: 'BANK_D', to: 'BANK_E' }]);
  };
  const handleClear = () => { setNodesInput(''); setRiskyEdges([]); setResult(null); setError(null); };
  
  const handleAnalyze = async () => {
    setError(null);
    setResult(null);

    const nodes = parseNodes(nodesInput);

    if (nodes.length === 0) {
      setError('Please provide at least one banking entity.');
      return;
    }

    // Filter valid edges
    const validEdges = riskyEdges.filter(e => e.from && e.to);
    
    // Check unknown nodes
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
      <header className="page-header">
        <h1>Banking Risk Coverage</h1>
        <p>Identify a minimum set of critical banking entities/channels that covers all risky relationships using Vertex Cover.</p>
      </header>

      <div className="content-section">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Banking Entities (One per line)</label>
            <textarea 
              rows="6" 
              value={nodesInput} 
              onChange={(e) => setNodesInput(e.target.value)} 
              placeholder="BANK_A&#10;BANK_B" 
            />
          </div>
        </div>

        <div className="form-group mt-4">
          <label>Risky Relationships</label>
          <table className="edges-table">
            <thead>
              <tr>
                <th>Entity 1</th>
                <th>Entity 2</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riskyEdges.map((edge, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={edge.from} onChange={(e) => handleEdgeChange(index, 'from', e.target.value)} placeholder="e.g. BANK_A" />
                  </td>
                  <td>
                    <input type="text" value={edge.to} onChange={(e) => handleEdgeChange(index, 'to', e.target.value)} placeholder="e.g. BANK_B" />
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary" onClick={() => handleRemoveEdge(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddEdge}>+ Add Risky Relationship</button>
        </div>

        <div className="form-actions mt-4">
          
        <button className="btn btn-secondary mr-2" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-tertiary mr-2" onClick={handleClear}>Clear</button>
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Risk Coverage'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Banking Risk Coverage</h2>
            <div className="result-card">
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Risky Relationships:</strong> {result.riskyEdges}</p>
              <p><strong>Covered Relationships:</strong> {result.coveredEdges} / {result.riskyEdges}</p>
              <p><strong>Coverage:</strong> {result.coveragePercentage}%</p>
              <p><strong>Vertex Cover Valid:</strong> {result.validVertexCover ? 'YES' : 'NO'}</p>
              
              {result.exactCoverSize !== null && (
                <div className="mt-2">
                  <p><strong>Exact Cover Size:</strong> {result.exactCoverSize}</p>
                  <p><strong>Approximate Cover Size:</strong> {result.approximateCoverSize}</p>
                  <p><strong>Approximation Ratio:</strong> {result.approximationRatio?.toFixed(2)}</p>
                </div>
              )}

              <div className="mt-4">
                <strong>Selected Critical Entities:</strong>
                <ul className="assignment-list mt-2">
                  {result.selectedEntities.map((entity, i) => (
                    <li key={i}>{entity}</li>
                  ))}
                  {result.selectedEntities.length === 0 && (
                    <li>No entities selected.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="info-panel mt-4">
          <p>
            "Selected entities represent a monitoring set that covers every risky
            relationship in the supplied network."
          </p>
          <p><em>Note: This is an educational DSA banking application. Do NOT claim that this alone is a production risk engine.</em></p>
        </div>
      </div>
    </div>
  );
}

export default RiskCoverage;
