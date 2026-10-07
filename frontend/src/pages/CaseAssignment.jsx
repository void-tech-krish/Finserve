import React, { useState } from 'react';
import { assignCases } from '../services/api';

function CaseAssignment() {
  const [casesInput, setCasesInput] = useState('');
  const [analystsInput, setAnalystsInput] = useState('');
  const [eligibility, setEligibility] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddEligibility = () => {
    setEligibility([...eligibility, { caseId: '', analystId: '' }]);
  };

  const handleEligibilityChange = (index, field, value) => {
    const newEl = [...eligibility];
    newEl[index][field] = value;
    setEligibility(newEl);
  };

  const handleRemoveEligibility = (index) => {
    setEligibility(eligibility.filter((_, i) => i !== index));
  };

  const parseLines = (text) => text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  
  const handleLoadExample = () => {
    setCasesInput('CASE-101\nCASE-102\nCASE-103\nCASE-104');
    setAnalystsInput('ANALYST-A\nANALYST-B\nANALYST-C');
    setEligibility([{ caseId: 'CASE-101', analystId: 'ANALYST-A' }, { caseId: 'CASE-101', analystId: 'ANALYST-C' }, { caseId: 'CASE-102', analystId: 'ANALYST-B' }]);
  };
  const handleClear = () => { setCasesInput(''); setAnalystsInput(''); setEligibility([]); setResult(null); setError(null); };
  
  const handleAssign = async () => {
    setError(null);
    setResult(null);

    const cases = parseLines(casesInput);
    const analysts = parseLines(analystsInput);

    if (cases.length === 0) {
      setError('Please provide at least one case.');
      return;
    }
    if (analysts.length === 0) {
      setError('Please provide at least one analyst.');
      return;
    }

    // Filter valid eligibilities
    const validEligibility = eligibility.filter(e => e.caseId && e.analystId);
    
    // Check unknown case/analyst
    for (let el of validEligibility) {
        if (!cases.includes(el.caseId)) {
            setError(`Unknown case in eligibility: ${el.caseId}`);
            return;
        }
        if (!analysts.includes(el.analystId)) {
            setError(`Unknown analyst in eligibility: ${el.analystId}`);
            return;
        }
    }

    setLoading(true);
    try {
      const payload = {
        cases,
        analysts,
        eligibility: validEligibility
      };
      const res = await assignCases(payload);
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
        <h1>Fraud Case Assignment</h1>
        <p>Assign fraud cases to eligible analysts using Bipartite Matching.</p>
      </header>

      <div className="content-section">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Fraud Cases (One per line)</label>
            <textarea 
              rows="6" 
              value={casesInput} 
              onChange={(e) => setCasesInput(e.target.value)} 
              placeholder="CASE-101&#10;CASE-102" 
            />
          </div>
          <div className="form-group">
            <label>Available Analysts (One per line)</label>
            <textarea 
              rows="6" 
              value={analystsInput} 
              onChange={(e) => setAnalystsInput(e.target.value)} 
              placeholder="ANALYST-A&#10;ANALYST-B" 
            />
          </div>
        </div>

        <div className="form-group mt-4">
          <label>Eligibility Relationships</label>
          <table className="edges-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Eligible Analyst</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {eligibility.map((el, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={el.caseId} onChange={(e) => handleEligibilityChange(index, 'caseId', e.target.value)} placeholder="e.g. CASE-101" />
                  </td>
                  <td>
                    <input type="text" value={el.analystId} onChange={(e) => handleEligibilityChange(index, 'analystId', e.target.value)} placeholder="e.g. ANALYST-A" />
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary" onClick={() => handleRemoveEligibility(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddEligibility}>+ Add Eligibility</button>
        </div>

        <div className="form-actions mt-4">
          
        <button className="btn btn-secondary mr-2" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-tertiary mr-2" onClick={handleClear}>Clear</button>
        <button className="btn btn-primary" onClick={handleAssign} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Cases'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Fraud Case Assignment</h2>
            <div className="result-card">
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Total Cases:</strong> {result.totalCases}</p>
              <p><strong>Available Analysts:</strong> {result.totalAnalysts}</p>
              <p><strong>Maximum Assignments:</strong> {result.matchedCases}</p>
              
              <div className="mt-4">
                <strong>Matching Visualization:</strong>
                <ul className="assignment-list mt-2" style={{ fontFamily: 'monospace' }}>
                  {result.assignments.map((assignment, i) => (
                    <li key={i}>{assignment.caseId} ───────→ {assignment.analystId}</li>
                  ))}
                  {result.assignments.length === 0 && (
                    <li>No assignments made.</li>
                  )}
                </ul>
              </div>

              {result.unassignedCases && result.unassignedCases.length > 0 && (
                <div className="mt-4">
                  <strong>Unassigned Cases:</strong>
                  <ul className="unassigned-list mt-2">
                    {result.unassignedCases.map((uc, i) => (
                      <li key={i}>{uc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-panel mt-4">
          <p>
            "Each fraud case is connected to analysts who are eligible to investigate
            it. Bipartite Matching finds the largest possible set of one-to-one
            case-to-analyst assignments."
          </p>
        </div>
      </div>
    </div>
  );
}

export default CaseAssignment;
