import React, { useState } from 'react';
import { assignCases } from '../services/api';
import { Layers, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

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
    setEligibility([
      { caseId: 'CASE-101', analystId: 'ANALYST-A' }, 
      { caseId: 'CASE-101', analystId: 'ANALYST-C' }, 
      { caseId: 'CASE-102', analystId: 'ANALYST-B' }
    ]);
  };

  const handleClear = () => { 
    setCasesInput(''); 
    setAnalystsInput(''); 
    setEligibility([]); 
    setResult(null); 
    setError(null); 
  };
  
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

    const validEligibility = eligibility.filter(e => e.caseId && e.analystId);
    
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
      <PageHeader 
        eyebrow="Network Analytics — Case Assignment"
        title="Bipartite Fraud Case Assignment"
        subtitle="Optimum one-to-one mapping of unassigned fraud investigation cases to eligible risk analysts using Maximum Bipartite Matching."
        meta={
          <>
            <span>ALGORITHM: BIPARTITE MATCHING</span>
            <span>•</span>
            <span>COMPLEXITY: O(V * E) / HOPCROFT-KARP</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Fraud Cases & Analyst Roster"
        description="Enter unassigned case IDs, analyst handles, and qualification links."
        tag="BIPARTITE"
        tagVariant="clay"
        icon={Layers}
        watermark="01"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label>Fraud Cases (One per line)</label>
            <textarea 
              className="form-control banking-textarea"
              style={{ minHeight: '100px' }}
              value={casesInput} 
              onChange={(e) => setCasesInput(e.target.value)} 
              placeholder="CASE-101&#10;CASE-102" 
            />
          </div>
          <div className="form-group">
            <label>Available Analysts (One per line)</label>
            <textarea 
              className="form-control banking-textarea"
              style={{ minHeight: '100px' }}
              value={analystsInput} 
              onChange={(e) => setAnalystsInput(e.target.value)} 
              placeholder="ANALYST-A&#10;ANALYST-B" 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Qualification Eligibility Links</label>
          <div className="overflow-x-auto mb-3">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Eligible Analyst</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((el, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="text" 
                        className="form-control"
                        value={el.caseId} 
                        onChange={(e) => handleEligibilityChange(index, 'caseId', e.target.value)} 
                        placeholder="e.g. CASE-101" 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control"
                        value={el.analystId} 
                        onChange={(e) => handleEligibilityChange(index, 'analystId', e.target.value)} 
                        placeholder="e.g. ANALYST-A" 
                      />
                    </td>
                    <td className="text-right">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveEligibility(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {eligibility.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center font-mono text-xs text-dim py-6">
                      No eligibility links added. Click "Load Example" or "+ Add Eligibility".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddEligibility}>
            + Add Qualification Link
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-line">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Cases'}
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
          title="Optimal Bipartite Matching Output"
          description={`Assigned ${result.matchedCases} out of ${result.totalCases} cases to ${result.totalAnalysts} analysts.`}
          tag="MATCHED"
          tagVariant="brass"
          watermark="02"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Total Cases</span>
              <span className="font-mono text-lg text-paper font-bold"><CountUpNumber end={result.totalCases} /></span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Analysts</span>
              <span className="font-mono text-lg text-paper font-bold"><CountUpNumber end={result.totalAnalysts} /></span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Matched Assignments</span>
              <span className="font-mono text-lg text-brass font-bold"><CountUpNumber end={result.matchedCases} /></span>
            </div>
          </div>

          <div className="p-4 bg-ink-3 rounded border border-line mb-4">
            <h4 className="font-mono text-xs uppercase text-brass mb-3">Assigned Pairing Vectors:</h4>
            <div className="space-y-2 font-mono text-xs">
              {result.assignments && result.assignments.map((as, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-ink-2 rounded border border-line">
                  <span className="text-paper font-bold">{as.caseId}</span>
                  <span className="text-brass font-bold">&rarr;</span>
                  <span className="text-clay font-bold">{as.analystId}</span>
                </div>
              ))}
              {(!result.assignments || result.assignments.length === 0) && (
                <span className="text-dim">No assignments made.</span>
              )}
            </div>
          </div>

          {result.unassignedCases && result.unassignedCases.length > 0 && (
            <div className="p-4 bg-ink-3 rounded border border-line">
              <h4 className="font-mono text-xs uppercase text-sage mb-2">Unassigned Pending Cases:</h4>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {result.unassignedCases.map((uc, i) => (
                  <span key={i} className="badge badge-danger">{uc}</span>
                ))}
              </div>
            </div>
          )}
        </Plate>
      )}

      <Plate
        number={3}
        title="Why Bipartite Matching?"
        description="Optimal 1-to-1 resource allocation on bipartite graphs."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          Each fraud case is connected to analysts who are eligible to investigate it. Bipartite Matching finds the largest possible set of one-to-one case-to-analyst assignments using augmented path searching.
        </p>
      </Plate>
    </div>
  );
}

export default CaseAssignment;
