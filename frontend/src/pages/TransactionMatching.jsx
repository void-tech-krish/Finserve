import { useState } from 'react';
import { matchTransaction } from '../services/api';
import { AlertTriangle, CheckCircle2, XCircle, Info, FileText } from 'lucide-react';

export default function TransactionMatching() {
  const [transactionA, setTransactionA] = useState('AMAZON PAYMENT');
  const [transactionB, setTransactionB] = useState('AMAZN PAYMENT');
  const [algorithm, setAlgorithm] = useState('levenshtein');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    if (!transactionA || !transactionB) {
      setError('Both transactions are required for comparison.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await matchTransaction(transactionA, transactionB, algorithm);
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
        <h1>Transaction Matching</h1>
        <p>Identify whether two transaction descriptions are likely to refer to the same transaction.</p>
      </header>

      <div className="card search-card">
        <h3><FileText size={18} /> Compare Transactions</h3>
        <div className="form-group">
          <label>Transaction A</label>
          <input 
            type="text"
            value={transactionA} 
            onChange={e => setTransactionA(e.target.value)}
            placeholder="e.g. AMAZON PAYMENT"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Transaction B</label>
          <input 
            type="text"
            value={transactionB} 
            onChange={e => setTransactionB(e.target.value)}
            placeholder="e.g. AMAZN PAYMENT"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Algorithm</label>
          <select 
            value={algorithm} 
            onChange={e => setAlgorithm(e.target.value)}
            className="form-control"
          >
            <option value="levenshtein">Levenshtein</option>
            <option value="damerau-levenshtein">Damerau-Levenshtein</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleMatch} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare Transactions'}
        </button>
      </div>

      <div className="card info-card mt-4">
        <h4>Banking Examples</h4>
        <ul style={{ fontSize: '0.9em', color: '#555', marginTop: '10px' }}>
          <li>AMAZON PAYMENT vs AMAZN PAYMENT</li>
          <li>WALMART STORE vs WALMART STROE</li>
          <li>UPI PAYMENT 9281 vs UPI PAYMNT 9281</li>
          <li>SALARY CREDIT ABC LTD vs SALARY CRDIT ABC LTD</li>
        </ul>
      </div>

      {error && (
        <div className="alert alert-danger mt-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {result && (
        <div className={`card result-card ${result.matched ? 'found' : 'not-found'} mt-4`}>
          {result.matched ? (
            <>
              <h3><CheckCircle2 size={24} color="#22c55e" /> LIKELY MATCH</h3>
              <div className="result-grid mt-4">
                <div><strong>Edit Distance:</strong> {result.distance}</div>
                <div><strong>Algorithm:</strong> {result.algorithm}</div>
                <div><strong>Threshold:</strong> &lt;= 2</div>
              </div>
              <div className="mt-4 p-3 bg-light rounded border">
                <div><strong>Transaction A:</strong> {result.transactionA}</div>
                <div><strong>Transaction B:</strong> {result.transactionB}</div>
              </div>
            </>
          ) : (
            <>
              <h3><XCircle size={24} color="#ef4444" /> DIFFERENT</h3>
              <div className="result-grid mt-4">
                <div><strong>Edit Distance:</strong> {result.distance}</div>
                <div><strong>Algorithm:</strong> {result.algorithm}</div>
                <div><strong>Threshold:</strong> &lt;= 2</div>
              </div>
              <div className="mt-4 p-3 bg-light rounded border">
                <div><strong>Transaction A:</strong> {result.transactionA}</div>
                <div><strong>Transaction B:</strong> {result.transactionB}</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="card info-card mt-4">
        <h3><Info size={18} /> How it works</h3>
        <p>Edit distance measures how many character-level changes (insertions, deletions, substitutions) are required to transform one transaction description into another. Damerau-Levenshtein also accounts for adjacent transpositions.</p>
      </div>
    </div>
  );
}
