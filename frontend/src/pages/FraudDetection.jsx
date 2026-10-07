import { useState } from 'react';
import { detectFraud } from '../services/api';
import { AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert } from 'lucide-react';

export default function FraudDetection() {
  const [transactionText, setTransactionText] = useState('TRANSFER TO UNKNOWN ACCOUNT REF-9281 URGENT CASH WITHDRAWAL');
  const [patternsText, setPatternsText] = useState('UNKNOWN ACCOUNT\nURGENT\nCASH WITHDRAWAL\nSUSPICIOUS');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const fraudPatterns = patternsText.split('\n').map(p => p.trim()).filter(p => p.length > 0);

    try {
      const data = await detectFraud(transactionText, fraudPatterns);
      setResult(data);
    } catch (err) {
      setError('Unable to connect to the banking analysis service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Fraud Detection</h1>
        <p>Detect multiple suspicious patterns simultaneously using Aho-Corasick.</p>
      </header>

      <div className="card search-card">
        <h3><ShieldAlert size={18} /> Fraud Pattern Analysis</h3>
        <div className="form-group">
          <label>Transaction Description / Transaction Text</label>
          <textarea 
            rows={3}
            value={transactionText} 
            onChange={e => setTransactionText(e.target.value)}
            placeholder="Enter transaction text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Fraud Patterns (One per line)</label>
          <textarea 
            rows={5}
            value={patternsText} 
            onChange={e => setPatternsText(e.target.value)}
            placeholder="Enter fraud patterns"
            className="form-control"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Transaction'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mt-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {result && (
        <div className={`card result-card ${result.fraudDetected ? 'not-found' : 'found'} mt-4`}>
          {result.fraudDetected ? (
            <>
              <h3><AlertTriangle size={24} color="#ef4444" /> FRAUD DETECTED</h3>
              <p className="mt-2 text-danger"><strong>{result.matchCount} suspicious patterns found</strong></p>
              <ul className="mt-2">
                {result.matchedPatterns.map((match, idx) => (
                  <li key={idx}>✓ <strong>{match.pattern}</strong> (at position {match.position})</li>
                ))}
              </ul>
              <div className="result-grid mt-4">
                <div><strong>Algorithm:</strong> {result.algorithm}</div>
                <div><strong>Complexity:</strong> {result.complexity}</div>
              </div>
            </>
          ) : (
            <>
              <h3><CheckCircle2 size={24} color="#22c55e" /> NO FRAUD DETECTED</h3>
              <p className="mt-2">No suspicious patterns matched.</p>
              <div className="result-grid mt-4">
                <div><strong>Algorithm:</strong> {result.algorithm}</div>
                <div><strong>Complexity:</strong> {result.complexity}</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="card info-card mt-4">
        <h3><Info size={18} /> Why Aho-Corasick?</h3>
        <p>It can search for multiple patterns simultaneously in a transaction description, making it suitable for checking many known fraud indicators at once.</p>
      </div>
    </div>
  );
}
