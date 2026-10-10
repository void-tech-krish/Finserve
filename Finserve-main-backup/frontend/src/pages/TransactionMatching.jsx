import { useState } from 'react';
import { matchTransaction } from '../services/api';
import { AlertTriangle, GitCompare, Info, FileText, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import ResultCard from '../components/ResultCard';
import KineticExamples from '../components/KineticExamples';

export default function TransactionMatching() {
  const [transactionA, setTransactionA] = useState('');
  const [transactionB, setTransactionB] = useState('');
  const [algorithm, setAlgorithm] = useState('levenshtein');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bankingExamples = [
    { a: 'AMAZON PAYMENT', b: 'AMAZN PAYMENT' },
    { a: 'WALMART STORE', b: 'WALMART STROE' },
    { a: 'UPI PAYMENT 9281', b: 'UPI PAYMNT 9281' },
    { a: 'SALARY CREDIT ABC LTD', b: 'SALARY CRDIT ABC LTD' }
  ];

  const handleLoadExample = (strA = 'AMAZON PAYMENT', strB = 'AMAZN PAYMENT') => {
    setTransactionA(strA);
    setTransactionB(strB);
  };

  const handleClear = () => { 
    setTransactionA(''); 
    setTransactionB(''); 
    setResult(null); 
    setError(null); 
  };
  
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
      <PageHeader 
        eyebrow="Transaction Intelligence — Matching"
        title="Transaction Matching"
        subtitle="Identify whether two transaction descriptions are likely to refer to the same transaction using edit distance string metrics."
        meta={
          <>
            <span>ALGORITHMS: LEVENSHTEIN / DAMERAU</span>
            <span>•</span>
            <span>THRESHOLD: &le; 2 EDITS</span>
          </>
        }
      />

      <Plate 
        number={1} 
        title="Compare Transactions" 
        description="Enter transaction text strings or select a banking example below."
        tag="LIVE ANALYTICS"
        tagVariant="brass"
        icon={FileText}
        watermark="01"
      >
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
        
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button className="btn btn-secondary" onClick={() => handleLoadExample()}>
            Load Example
          </button>
          <button className="btn btn-tertiary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleMatch} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner mr-2"></span> Comparing...
              </>
            ) : (
              <>
                <GitCompare size={16} /> Compare Transactions
              </>
            )}
          </button>
        </div>
      </Plate>

      <Plate 
        number={2} 
        title="Banking Examples" 
        description="Live terminal stream cycling through common banking transaction typo pairs."
        tag="EXAMPLE STREAM"
        tagVariant="clay"
        watermark="02"
      >
        <KineticExamples 
          examples={bankingExamples} 
          onLoadExample={(a, b) => handleLoadExample(a, b)} 
        />
      </Plate>

      {error && (
        <div className="alert alert-danger mt-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {result && <ResultCard result={result} />}

      <Plate 
        number={3} 
        title="How it works" 
        description="Dynamic programming edit distance algorithm breakdown."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          Edit distance measures how many character-level changes (insertions, deletions, substitutions) are required to transform one transaction description into another. Damerau-Levenshtein also accounts for adjacent transpositions (e.g. swapping "TR" to "RT").
        </p>
      </Plate>
    </div>
  );
}
