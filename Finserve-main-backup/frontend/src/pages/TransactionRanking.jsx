import React, { useState } from 'react';
import { rankTransactions } from '../services/api';
import { Zap, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

function TransactionRanking() {
  const [transactions, setTransactions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = () => {
    setTransactions([...transactions, { transactionId: '', amount: '' }]);
  };

  const handleTransactionChange = (index, field, value) => {
    const newTxns = [...transactions];
    newTxns[index][field] = value;
    setTransactions(newTxns);
  };

  const handleRemoveTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleLoadExample = () => {
    setTransactions([
      { transactionId: 'TXN-101', amount: '4500' },
      { transactionId: 'TXN-102', amount: '1200' },
      { transactionId: 'TXN-103', amount: '9800' },
      { transactionId: 'TXN-104', amount: '3200' }
    ]);
  };

  const handleClear = () => { 
    setTransactions([]); 
    setResult(null); 
    setError(null); 
  };
  
  const handleRank = async () => {
    setError(null);
    setResult(null);

    const validTxns = transactions.filter(t => t.transactionId && t.amount);
    
    if (validTxns.length === 0) {
      setError('Please provide at least one valid transaction.');
      return;
    }

    let payloadTxns;
    try {
      payloadTxns = validTxns.map(t => {
        const amt = parseInt(t.amount, 10);
        if (isNaN(amt) || amt < 0) {
          throw new Error(`Invalid amount for ${t.transactionId}`);
        }
        return { transactionId: t.transactionId, amount: amt };
      });
    } catch (e) {
      setError(e.message);
      return;
    }

    setLoading(true);
    try {
      const payload = { transactions: payloadTxns };
      const res = await rankTransactions(payload);
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
        eyebrow="Transaction Intelligence — Ranking"
        title="Transaction Amount Ranking"
        subtitle="Sort and rank transactions by monetary value using Randomized QuickSort with randomized pivot selection."
        meta={
          <>
            <span>ALGORITHM: RANDOMIZED QUICKSORT</span>
            <span>•</span>
            <span>EXPECTED TIME: O(N LOG N)</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Transaction Dataset Payload"
        description="Add transaction IDs and numeric amounts to rank."
        tag="QUICKSORT"
        tagVariant="brass"
        icon={Zap}
        watermark="01"
      >
        <div className="overflow-x-auto mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (₹)</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="text" 
                      className="form-control"
                      value={txn.transactionId} 
                      onChange={(e) => handleTransactionChange(index, 'transactionId', e.target.value)} 
                      placeholder="e.g. TXN-101" 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="form-control"
                      value={txn.amount} 
                      onChange={(e) => handleTransactionChange(index, 'amount', e.target.value)} 
                      placeholder="e.g. 4500" 
                    />
                  </td>
                  <td className="text-right">
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveTransaction(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center font-mono text-xs text-dim py-6">
                    No transactions added. Click "Load Example" or "+ Add Transaction".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddTransaction}>
          + Add Transaction Row
        </button>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-line">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleRank} disabled={loading}>
            {loading ? 'Ranking...' : 'Rank Transactions'}
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
          title="Ranked Telemetry Results"
          description={`Order: ${result.order || 'Highest → Lowest'}`}
          tag="RANKED"
          tagVariant="brass"
          watermark="02"
        >
          <div className="mb-4 font-mono text-xs text-dim flex gap-4">
            <span>Algorithm: <strong className="text-paper">{result.algorithm}</strong></span>
            <span>Order: <strong className="text-brass">{result.order}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Transaction ID</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {result.transactions && result.transactions.map((t, idx) => (
                  <tr key={idx}>
                    <td className="font-mono font-bold text-brass">#{t.rank}</td>
                    <td className="font-mono text-paper font-semibold">{t.transactionId}</td>
                    <td className="font-mono text-paper">₹{t.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Plate>
      )}

      <Plate
        number={3}
        title="Why Randomized QuickSort?"
        description="Worst-case avoidance in transaction stream ordering."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          Randomized QuickSort efficiently ranks large transaction collections while using randomized pivot selection to guarantee expected O(N log N) performance regardless of adversary input ordering.
        </p>
      </Plate>
    </div>
  );
}

export default TransactionRanking;
