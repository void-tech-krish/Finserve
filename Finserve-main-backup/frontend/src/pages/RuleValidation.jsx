import React, { useState } from 'react';
import { validateRules } from '../services/api';
import { Activity, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import ScrambleText from '../components/ScrambleText';

function RuleValidation() {
  const [variablesInput, setVariablesInput] = useState('');
  const [clauses, setClauses] = useState([]);
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

  const handleLoadExample = () => {
    setVariablesInput('HIGH_AMOUNT\nINTERNATIONAL\nNEW_DEVICE\nVERIFIED_USER\nHIGH_RISK_COUNTRY');
    setClauses([
      ['HIGH_AMOUNT', 'INTERNATIONAL', 'VERIFIED_USER'], 
      ['!HIGH_AMOUNT', 'NEW_DEVICE', 'VERIFIED_USER'], 
      ['INTERNATIONAL', '!NEW_DEVICE', 'HIGH_RISK_COUNTRY']
    ]);
  };

  const handleClear = () => { 
    setVariablesInput(''); 
    setClauses([]); 
    setResult(null); 
    setError(null); 
  };
  
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
      <PageHeader 
        eyebrow="Fraud & Risk — Rule Validation"
        title="Banking Rule Satisfiability (3-SAT)"
        subtitle="Validate whether complex banking fraud rules and regulatory policy constraints are logically satisfiable using 3-SAT reduction."
        meta={
          <>
            <span>ALGORITHM: 3-SAT REDUCTION</span>
            <span>•</span>
            <span>COMPLEXITY: NP-COMPLETE / DPLL</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Boolean Rule Specification"
        description="Define risk variables and 3-literal CNF clause constraints (prefix with ! for negation)."
        tag="3-SAT"
        tagVariant="sage"
        icon={Activity}
        watermark="01"
      >
        <div className="form-group mb-4">
          <label>Risk Variables (One per line)</label>
          <textarea 
            className="form-control banking-textarea"
            style={{ minHeight: '90px' }}
            value={variablesInput} 
            onChange={(e) => setVariablesInput(e.target.value)} 
            placeholder="HIGH_AMOUNT&#10;INTERNATIONAL" 
          />
        </div>

        <div className="form-group">
          <label>3-Literal CNF Clauses</label>
          <div className="space-y-3 mb-3">
            {clauses.map((clause, index) => (
              <div key={index} className="p-3 bg-ink-3 border border-line rounded flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-brass font-bold">Clause {index + 1}:</span>
                <input 
                  type="text" 
                  className="form-control font-mono text-xs" 
                  style={{ width: '140px' }}
                  value={clause[0]} 
                  onChange={(e) => handleClauseChange(index, 0, e.target.value)} 
                  placeholder="Literal 1 (e.g. HIGH_AMOUNT)" 
                />
                <span className="font-mono text-xs text-dim">OR</span>
                <input 
                  type="text" 
                  className="form-control font-mono text-xs" 
                  style={{ width: '140px' }}
                  value={clause[1]} 
                  onChange={(e) => handleClauseChange(index, 1, e.target.value)} 
                  placeholder="Literal 2 (e.g. !NEW_DEVICE)" 
                />
                <span className="font-mono text-xs text-dim">OR</span>
                <input 
                  type="text" 
                  className="form-control font-mono text-xs" 
                  style={{ width: '140px' }}
                  value={clause[2]} 
                  onChange={(e) => handleClauseChange(index, 2, e.target.value)} 
                  placeholder="Literal 3 (e.g. VERIFIED_USER)" 
                />
                <button type="button" className="btn btn-danger btn-sm ml-auto" onClick={() => handleRemoveClause(index)}>
                  Remove
                </button>
              </div>
            ))}
            {clauses.length === 0 && (
              <div className="p-4 text-center font-mono text-xs text-dim border border-line rounded">
                No clauses added. Click "Load Example" or "+ Add Clause".
              </div>
            )}
          </div>
          <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddClause}>
            + Add 3-Literal Clause
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-line">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleValidate} disabled={loading}>
            {loading ? 'Validating...' : 'Validate Banking Rules'}
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
          title="Satisfiability Telemetry Output"
          description={`Tested ${result.variableCount} variables across ${result.clauseCount} clauses.`}
          tag={result.satisfiable ? "SATISFIABLE" : "UNSATISFIABLE"}
          tagVariant={result.satisfiable ? "brass" : "sage"}
          watermark="02"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
            <h3 className="font-serif text-2xl italic font-bold" style={{ color: result.satisfiable ? 'var(--brass)' : 'var(--sage)' }}>
              <ScrambleText text={result.satisfiable ? 'RULES ARE SATISFIABLE' : 'UNSATISFIABLE CONFLICT DETECTED'} />
            </h3>
          </div>

          {result.satisfiable && result.assignment && (
            <div className="p-4 bg-ink-3 rounded border border-line">
              <h4 className="font-mono text-xs uppercase text-brass mb-3">Truth Assignment Vector:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                {Object.entries(result.assignment).map(([variable, value]) => (
                  <div key={variable} className="flex justify-between p-2 bg-ink-2 rounded border border-line">
                    <span className="text-paper">{variable}:</span>
                    <span className={value ? 'text-brass font-bold' : 'text-sage font-bold'}>
                      {value ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Plate>
      )}

      <Plate
        number={3}
        title="Why 3-SAT Reduction?"
        description="NP-Complete formal validation of non-conflicting rule policy sets."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          3-SAT models Boolean constraints where each rule contains three literals. It allows formal mathematical verification that complex fraud policies and regulatory compliance rules contain no mutual contradictions.
        </p>
      </Plate>
    </div>
  );
}

export default RuleValidation;
