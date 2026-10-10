import { useState } from 'react';
import { detectFraud } from '../services/api';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import ScrambleText from '../components/ScrambleText';
import CountUpNumber from '../components/CountUpNumber';

export default function FraudDetection() {
  const [transactionText, setTransactionText] = useState('');
  const [patternsText, setPatternsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const handleLoadExample = () => {
    setTransactionText('TRANSFER TO UNKNOWN ACCOUNT REF-9281 URGENT CASH WITHDRAWAL');
    setPatternsText('UNKNOWN ACCOUNT\nURGENT\nCASH WITHDRAWAL\nSUSPICIOUS');
  };

  const handleClear = () => { 
    setTransactionText(''); 
    setPatternsText(''); 
    setResult(null); 
    setError(null); 
    setValidationError(null);
  };
  
  const handleAnalyze = async () => {
    setValidationError(null);
    if (!transactionText.trim()) {
      setValidationError('Please enter a transaction description.');
      return;
    }
    const fraudPatterns = patternsText.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (fraudPatterns.length === 0) {
      setValidationError('Please enter at least one fraud pattern.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await detectFraud(transactionText, fraudPatterns);
      setResult({
        ...data,
        patternsChecked: fraudPatterns.length
      });
    } catch (err) {
      setError('Unable to connect to the fraud analysis service. Please make sure the Spring Boot backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Fraud & Risk — Detection"
        title="Fraud Pattern Detection"
        subtitle="Scan transaction text payloads against multiple known fraud indicators simultaneously using Aho-Corasick automaton automata trees."
        meta={
          <>
            <span>ALGORITHM: AHO-CORASICK AUTOMATON</span>
            <span>•</span>
            <span>COMPLEXITY: O(N + M + Z)</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Fraud Pattern Analysis"
        description="Provide transaction description and list of suspicious fraud keywords (one per line)."
        tag="AHO-CORASICK AUTOMATON"
        tagVariant="sage"
        icon={ShieldAlert}
        watermark="01"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Transaction Description / Text</label>
            <textarea 
              className="form-control banking-textarea"
              style={{ minHeight: '130px' }}
              value={transactionText} 
              onChange={e => setTransactionText(e.target.value)}
              placeholder="e.g. TRANSFER TO UNKNOWN ACCOUNT REF-9281 URGENT CASH WITHDRAWAL"
            />
          </div>
          
          <div className="form-group">
            <label>Fraud Patterns (One per line)</label>
            <textarea 
              className="form-control banking-textarea"
              style={{ minHeight: '130px' }}
              value={patternsText} 
              onChange={e => setPatternsText(e.target.value)}
              placeholder="UNKNOWN ACCOUNT&#10;URGENT&#10;CASH WITHDRAWAL"
            />
          </div>
        </div>

        {validationError && (
          <div className="text-sage text-xs font-mono mt-2 flex items-center gap-2">
            <AlertTriangle size={14} /> {validationError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : <><Search size={16} /> Analyze Transaction</>}
          </button>
        </div>
      </Plate>

      {error && (
        <div className="alert alert-danger mt-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div className="lg:col-span-2">
            <Plate
              number={2}
              title={result.fraudDetected ? "Detected Suspicious Patterns" : "No Fraud Indicators Detected"}
              description="Pattern location telemetry output."
              tag={result.fraudDetected ? "HIGH RISK" : "LOW RISK"}
              tagVariant={result.fraudDetected ? "sage" : "brass"}
              watermark="02"
            >
              {result.fraudDetected ? (
                <ul className="divide-y divide-line">
                  {result.matchedPatterns.map((match, idx) => (
                    <li key={idx} className="py-3 flex items-start gap-3">
                      <AlertTriangle size={18} className="text-sage shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-xs uppercase text-sage font-bold block">{match.pattern}</span>
                        <span className="font-mono text-xs text-dim">Position offset index {match.position} in transaction payload</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <CheckCircle2 size={28} className="text-brass shrink-0 opacity-80" />
                    <h3 className="font-serif text-xl text-brass mb-0">No Suspicious Indicators Detected</h3>
                  </div>
                  <p className="font-mono text-xs text-dim">Transaction text verified clean against supplied pattern dictionary.</p>
                </div>
              )}
            </Plate>
          </div>

          <div>
            <Plate
              number={3}
              title="Risk Telemetry"
              description="Quantitative summary."
              tag="SCORE"
              tagVariant={result.fraudDetected ? "sage" : "brass"}
              watermark="03"
            >
              <div className="space-y-4">
                <div className="p-3 bg-ink-3 rounded border border-line flex justify-between items-center">
                  <span className="font-mono text-xs text-dim uppercase">Patterns Checked</span>
                  <span className="font-mono text-lg text-paper font-bold"><CountUpNumber end={result.patternsChecked} /></span>
                </div>
                <div className="p-3 bg-ink-3 rounded border border-line flex justify-between items-center">
                  <span className="font-mono text-xs text-dim uppercase">Matches Found</span>
                  <span className="font-mono text-lg font-bold" style={{ color: result.matchCount > 0 ? 'var(--sage)' : 'var(--brass)' }}>
                    <CountUpNumber end={result.matchCount} />
                  </span>
                </div>
                <div className="p-3 bg-ink-3 rounded border border-line flex justify-between items-center">
                  <span className="font-mono text-xs text-dim uppercase">Risk Assessment</span>
                  <span className="font-serif text-lg font-bold italic" style={{ color: result.fraudDetected ? 'var(--sage)' : 'var(--brass)' }}>
                    <ScrambleText text={result.fraudDetected ? 'HIGH RISK' : 'LOW RISK'} />
                  </span>
                </div>
              </div>
            </Plate>
          </div>
        </div>
      )}

      <Plate
        number={4}
        title="Why Aho-Corasick Multi-Pattern Matching?"
        description="Linear time multi-keyword dictionary matching."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="04"
      >
        <p className="text-paper-dim text-sm">
          Aho-Corasick constructs a finite-state trie automaton with failure links, enabling searching for thousands of fraud keywords simultaneously in a single linear scan of transaction payload text.
        </p>
      </Plate>
    </div>
  );
}
