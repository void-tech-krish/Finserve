import React, { useState } from 'react';
import { rankTransactions } from '../services/api';

function TransactionRanking() {
  const [transactions, setTransactions] = useState([
    { transactionId: 'TXN-101', amount: '4500' },
    { transactionId: 'TXN-102', amount: '1200' },
    { transactionId: 'TXN-103', amount: '9800' },
    { transactionId: 'TXN-104', amount: '3200' }
  ]);
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

  const handleRank = async () => {
    setError(null);
    setResult(null);

    const validTxns = transactions.filter(t => t.transactionId && t.amount);
    
    if (validTxns.length === 0) {
      setError('Please provide at least one valid transaction.');
      return;
    }

    const payloadTxns = validTxns.map(t => {
      const amt = parseInt(t.amount, 10);
      if (isNaN(amt) || amt < 0) {
        throw new Error(`Invalid amount for ${t.transactionId}`);
      }
      return { transactionId: t.transactionId, amount: amt };
    });

    setLoading(true);
    try {
      const payload = {
        transactions: payloadTxns
      };
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
      <header className="page-header">
        <h1>Transaction Ranking</h1>
        <p>Rank transactions based on transaction amount using Randomized QuickSort.</p>
      </header>

      <div className="content-section">
        <div className="form-group">
          <label>Transactions</label>
          <table className="edges-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={txn.transactionId} onChange={(e) => handleTransactionChange(index, 'transactionId', e.target.value)} placeholder="e.g. TXN-101" />
                  </td>
                  <td>
                    <input type="number" value={txn.amount} onChange={(e) => handleTransactionChange(index, 'amount', e.target.value)} placeholder="e.g. 4500" />
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary" onClick={() => handleRemoveTransaction(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddTransaction}>+ Add Transaction</button>
        </div>

        <div className="form-actions mt-4">
          <button className="btn btn-primary" onClick={handleRank} disabled={loading}>
            {loading ? 'Ranking...' : 'Rank Transactions'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Transaction Ranking Results</h2>
            <div className="result-card">
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Ranking Order:</strong> Highest Amount → Lowest Amount ({result.order})</p>

              <div className="mt-4">
                <table className="comparison-table w-full">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Transaction ID</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.transactions.map((t, idx) => (
                      <tr key={idx}>
                        <td>{t.rank}</td>
                        <td>{t.transactionId}</td>
                        <td>{t.amount}</td>
                      </tr>
                    ))}
                    {result.transactions.length === 0 && (
                      <tr>
                        <td colSpan="3">No transactions ranked.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="info-panel mt-4">
          <p>
            "Randomized QuickSort efficiently ranks large transaction collections
            while using randomized pivot selection to reduce dependence on
            unfavorable input ordering."
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionRanking;
