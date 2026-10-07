import React, { useState } from 'react';
import { validateRules } from '../services/api';

function RuleValidation() {
  const [variablesInput, setVariablesInput] = useState('HIGH_AMOUNT\nINTERNATIONAL\nNEW_DEVICE\nVERIFIED_USER\nHIGH_RISK_COUNTRY');
  const [clauses, setClauses] = useState([
    ['HIGH_AMOUNT', 'INTERNATIONAL', 'VERIFIED_USER'],
    ['!HIGH_AMOUNT', 'NEW_DEVICE', 'VERIFIED_USER'],
    ['INTERNATIONAL', '!NEW_DEVICE', 'HIGH_RISK_COUNTRY']
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddClause = () => {
    setClauses([...clauses, ['', '', '']]);
  };

  const handleClauseChange = (clauseIndex, literalIndex, value) => {
    const newClauses = [...clauses];
    newClauses[clauseIndex][literalIndex] = value;
    setClauses(newClauses);
  };

  const handleRemoveClause = (index) => {
    setClauses(clauses.filter((_, i) => i !== index));
  };

  const parseVariables = (text) => text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const handleValidate = async () => {
    setError(null);
    setResult(null);

    const variables = parseVariables(variablesInput);

    if (variables.length === 0) {
      setError('Please provide at least one variable.');
      return;
    }
    if (clauses.length === 0) {
      setError('Please provide at least one clause.');
      return;
    }

    // Validate clauses
    for (let i = 0; i < clauses.length; i++) {
        const c = clauses[i];
        if (c.length !== 3) {
            setError(`Clause ${i + 1} must contain exactly 3 literals.`);
            return;
        }
        for (let lit of c) {
            if (!lit) {
                setError(`Clause ${i + 1} has an empty literal.`);
                return;
            }
            const varName = lit.startsWith('!') ? lit.substring(1) : lit;
            if (!variables.includes(varName)) {
                setError(`Unknown variable '${varName}' in Clause ${i + 1}.`);
                return;
            }
        }
    }

    setLoading(true);
    try {
      const payload = {
        variables,
        clauses
      };
      const res = await validateRules(payload);
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
        <h1>Banking Rule Validation</h1>
        <p>Validate whether banking/fraud configured rules are logically satisfiable using 3-SAT.</p>
      </header>

      <div className="content-section">
        <div className="form-group">
          <label>Variables (One per line)</label>
          <textarea 
            rows="6" 
            value={variablesInput} 
            onChange={(e) => setVariablesInput(e.target.value)} 
            placeholder="HIGH_AMOUNT&#10;INTERNATIONAL" 
          />
        </div>

        <div className="form-group mt-4">
          <label>Clauses (Must contain exactly 3 literals each. Prefix with ! for negation)</label>
          <div className="clauses-list">
            {clauses.map((clause, index) => (
              <div key={index} className="clause-row flex" style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <strong>Clause {index + 1}:</strong>
                <input type="text" value={clause[0]} onChange={(e) => handleClauseChange(index, 0, e.target.value)} placeholder="Literal 1" />
                <input type="text" value={clause[1]} onChange={(e) => handleClauseChange(index, 1, e.target.value)} placeholder="Literal 2" />
                <input type="text" value={clause[2]} onChange={(e) => handleClauseChange(index, 2, e.target.value)} placeholder="Literal 3" />
                <button type="button" className="btn btn-secondary" onClick={() => handleRemoveClause(index)}>Remove</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddClause}>+ Add Clause</button>
        </div>

        <div className="form-actions mt-4">
          <button className="btn btn-primary" onClick={handleValidate} disabled={loading}>
            {loading ? 'Validating...' : 'Validate Banking Rules'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Banking Rule Validation Result</h2>
            <div className="result-card">
              <p><strong>Status:</strong> {result.satisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}</p>
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Variables:</strong> {result.variableCount}</p>
              <p><strong>Clauses:</strong> {result.clauseCount}</p>

              <div className="mt-4">
                <strong>Configured Clauses:</strong>
                <ul className="mt-2">
                  {clauses.map((c, i) => (
                    <li key={i}>[ {c[0]} ] OR [ {c[1]} ] OR [ {c[2]} ]</li>
                  ))}
                </ul>
              </div>

              {result.satisfiable && result.assignment && (
                <div className="mt-4">
                  <strong>Satisfying Assignment:</strong>
                  <ul className="mt-2">
                    {Object.entries(result.assignment).map(([variable, value]) => (
                      <li key={variable}>{variable}: {value ? 'TRUE' : 'FALSE'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-panel mt-4">
          <p>
            "3-SAT models Boolean constraints where each rule contains three
            literals. In this banking example, it can be used to check whether
            multiple fraud or risk conditions are logically compatible."
          </p>
          <p><em>Note: This is a DSA demonstration, not a production compliance engine.</em></p>
        </div>
      </div>
    </div>
  );
}

export default RuleValidation;
