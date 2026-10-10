import { useState } from 'react';
import { searchTransaction } from '../services/api';
import { Search, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import ScrambleText from '../components/ScrambleText';

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
    setTransactionText('PAYMENT TXN-78492 AMAZON');
    setSearchPattern('TXN-78492');
  };

  const handleClear = () => { 
    setTransactionText(''); 
    setSearchPattern(''); 
    setResult(null); 
    setError(null); 
  };
  
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
      <PageHeader 
        eyebrow="Transaction Intelligence — Search"
        title="Transaction Reference Search"
        subtitle="Search transaction references and payment codes in logarithmic-linear time using Knuth-Morris-Pratt pattern matching."
        meta={
          <>
            <span>ALGORITHM: KMP (KNUTH-MORRIS-PRATT)</span>
            <span>•</span>
            <span>COMPLEXITY: O(N)</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Search Transaction / Reference Code"
        description="Provide target text payload and string pattern to execute exact KMP matching."
        tag="KMP ALGORITHM"
        tagVariant="brass"
        icon={Search}
        watermark="01"
      >
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
        
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search Transaction'}
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
          title={result.found ? "Match Telemetry Found" : "No Match Found"}
          description="KMP string matcher scan output."
          tag={result.found ? "FOUND" : "NOT FOUND"}
          tagVariant={result.found ? "brass" : "sage"}
          watermark="02"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
            {result.found ? (
              <CheckCircle2 size={28} className="text-brass" />
            ) : (
              <XCircle size={28} className="text-sage" />
            )}
            <h3 className="font-serif text-2xl italic font-bold" style={{ color: result.found ? 'var(--brass)' : 'var(--sage)' }}>
              <ScrambleText text={result.found ? "TRANSACTION REFERENCE FOUND" : "NO REFERENCE MATCH"} />
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Reference</span>
              <span className="font-mono text-sm text-paper font-bold">{result.pattern || searchPattern}</span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Index Position</span>
              <span className="font-mono text-sm text-brass font-bold">{result.position ?? -1}</span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Algorithm</span>
              <span className="font-mono text-sm text-paper font-semibold">{result.algorithm || 'KMP'}</span>
            </div>
            <div className="p-3 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim block">Time Complexity</span>
              <span className="font-mono text-sm text-clay font-semibold">{result.complexity || 'O(N)'}</span>
            </div>
          </div>

          {matchedDemo && (
            <div className="mt-4 p-4 bg-ink-3 rounded border border-line">
              <h4 className="font-mono text-xs uppercase text-brass mb-3">Matched Telemetry Payload:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                <div><span className="text-dim">ID:</span> <span className="text-paper">{matchedDemo.id}</span></div>
                <div><span className="text-dim">Amount:</span> <span className="text-brass">{matchedDemo.amount}</span></div>
                <div><span className="text-dim">Type:</span> <span className="text-paper">{matchedDemo.type}</span></div>
                <div>
                  <span className="text-dim">Status:</span>{' '}
                  <span className={`badge ${matchedDemo.status === 'Suspicious' ? 'danger' : 'success'}`}>
                    {matchedDemo.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Plate>
      )}

      <Plate
        number={3}
        title="Why Knuth-Morris-Pratt (KMP)?"
        description="Linear time string searching for banking transaction audit trails."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm mb-4">
          Knuth-Morris-Pratt efficiently searches for a transaction reference or payment code inside transaction text without repeatedly rechecking previously matched characters using an auxiliary Prefix Function (LPS array).
        </p>
      </Plate>
    </div>
  );
}
