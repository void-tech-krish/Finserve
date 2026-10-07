import { useState } from 'react';
import { searchTransaction } from '../services/api';
import { Search, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

const demoData = [
  { id: 'TXN-78491', amount: '₹12,000', type: 'Payment', status: 'Completed', description: 'PAYMENT TXN-78491 AMAZON' },
  { id: 'TXN-78492', amount: '₹84,500', type: 'Transfer', status: 'Suspicious', description: 'PAYMENT TXN-78492 AMAZON' },
  { id: 'TXN-78493', amount: '₹1,500', type: 'Refund', status: 'Completed', description: 'REFUND TXN-78493 FLIPKART' },
  { id: 'TXN-78494', amount: '₹9,200', type: 'Payment', status: 'Completed', description: 'PAYMENT TXN-78494 ZOMATO' },
  { id: 'TXN-78495', amount: '₹45,000', type: 'Transfer', status: 'Pending', description: 'PAYMENT TXN-78495 APPLE' }
];

export default function TransactionIntelligence() {
  const [transactionText, setTransactionText] = useState('PAYMENT TXN-78492 AMAZON');
  const [searchPattern, setSearchPattern] = useState('TXN-78492');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const handleLoadExample = () => {
    setSearchQuery('AMAZON');
  };
  const handleClear = () => { setSearchQuery(''); setResult(null); setError(null); };
  
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await searchTransaction(transactionText, searchPattern);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Backend unavailable. Please start the Spring Boot server.');
    } finally {
      setLoading(false);
    }
  };

  const matchedDemo = result?.found ? demoData.find(d => d.id === result.pattern) : null;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Transaction Intelligence</h1>
        <p>Search transaction references using efficient pattern matching.</p>
      </header>

      <div className="card search-card">
        <h3><Search size={18} /> Search Transaction / Reference Code</h3>
        <div className="form-group">
          <label>Transaction Text</label>
          <input 
            type="text" 
            value={transactionText} 
            onChange={e => setTransactionText(e.target.value)}
            placeholder="Enter transaction/reference text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Search Pattern</label>
          <input 
            type="text" 
            value={searchPattern} 
            onChange={e => setSearchPattern(e.target.value)}
            placeholder="Enter reference code"
            className="form-control"
          />
        </div>
        
        <button className="btn btn-secondary mr-2" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-tertiary mr-2" onClick={handleClear}>Clear</button>
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Transaction'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {result && (
        <div className={`card result-card ${result.found ? 'found' : 'not-found'}`}>
          {result.found ? (
            <>
              <h3><CheckCircle2 size={24} color="#22c55e" /> Transaction Reference Found</h3>
              <div className="result-grid">
                <div><strong>Reference:</strong> {result.pattern}</div>
                <div><strong>Position:</strong> {result.position}</div>
                <div><strong>Algorithm Used:</strong> {result.algorithm}</div>
                <div><strong>Complexity:</strong> {result.complexity}</div>
              </div>
              
              {matchedDemo && (
                <div className="demo-match">
                  <h4>Demo Dataset Match:</h4>
                  <div className="result-grid">
                    <div><strong>Transaction ID:</strong> {matchedDemo.id}</div>
                    <div><strong>Amount:</strong> {matchedDemo.amount}</div>
                    <div><strong>Type:</strong> {matchedDemo.type}</div>
                    <div>
                      <strong>Status: </strong>
                      <span className={`badge ${matchedDemo.status.toLowerCase()}`}>{matchedDemo.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <h3><XCircle size={24} color="#ef4444" /> Transaction Reference Not Found</h3>
              <div className="result-grid">
                <div><strong>Algorithm:</strong> {result.algorithm}</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="card info-card mt-4">
        <h3><Info size={18} /> Why KMP?</h3>
        <p>"Knuth-Morris-Pratt efficiently searches for a transaction reference or payment code inside transaction text without repeatedly rechecking previously matched characters."</p>
        <div className="flow-diagram">
          <div className="flow-step">Banking Problem<br/><small>Search transaction/reference</small></div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">DSA Algorithm<br/><small>KMP Pattern Matching</small></div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Search Result</div>
        </div>
      </div>
    </div>
  );
}
