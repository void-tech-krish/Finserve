import React, { useState } from 'react';
import { sampleTransactions } from '../services/api';

function TransactionSampling() {
  const [transactions, setTransactions] = useState([]);
  const [sampleSize, setSampleSize] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = () => {
    setTransactions([...transactions, { transactionId: '', amount: '', merchant: '' }]);
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
      { transactionId: 'TXN-101', amount: '4500', merchant: 'Amazon' },
      { transactionId: 'TXN-102', amount: '1200', merchant: 'Flipkart' },
      { transactionId: 'TXN-103', amount: '9800', merchant: 'Apple' },
      { transactionId: 'TXN-104', amount: '3200', merchant: 'Walmart' },
      { transactionId: 'TXN-105', amount: '750', merchant: 'Starbucks' },
      { transactionId: 'TXN-106', amount: '5600', merchant: 'Sony' },
      { transactionId: 'TXN-107', amount: '2300', merchant: 'Nike' }
    ]);
    setSampleSize('3');
  };
  const handleClear = () => { setTransactions([]); setSampleSize(''); setResult(null); setError(null); };
  
  const handleSample = async () => {
    setError(null);
    setResult(null);

    const validTxns = transactions.filter(t => t.transactionId && t.amount);
    
    if (validTxns.length === 0) {
      setError('Please provide at least one valid transaction.');
      return;
    }

    if (sampleSize <= 0) {
      setError('Sample size must be greater than 0.');
      return;
    }

    if (sampleSize > validTxns.length) {
      setError('Sample size cannot exceed the total number of transactions.');
      return;
    }

    const payloadTxns = validTxns.map(t => {
      const amt = parseInt(t.amount, 10);
      if (isNaN(amt) || amt < 0) {
        throw new Error(`Invalid or negative amount for ${t.transactionId}`);
      }
      return { transactionId: t.transactionId, amount: amt, merchant: t.merchant || '' };
    });

    setLoading(true);
    try {
      const payload = {
        transactions: payloadTxns,
        sampleSize: parseInt(sampleSize, 10)
      };
      const res = await sampleTransactions(payload);
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
        <h1>Transaction Sampling</h1>
        <p>Select a representative sample of banking transactions using Reservoir Sampling.</p>
      </header>

      <div className="content-section">
        <div className="form-group">
          <label>Transactions</label>
          <table className="edges-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (₹)</th>
                <th>Merchant</th>
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
                    <input type="text" value={txn.merchant} onChange={(e) => handleTransactionChange(index, 'merchant', e.target.value)} placeholder="e.g. Amazon" />
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

        <div className="form-group mt-4 flex" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ margin: 0 }}>Sample Size:</label>
          <input 
            type="number" 
            value={sampleSize} 
            onChange={(e) => setSampleSize(e.target.value)} 
            style={{ width: '100px' }} 
            min="1" 
            max={transactions.length}
          />
        </div>

        <div className="form-actions mt-4">
          
        <button className="btn btn-secondary mr-2" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-tertiary mr-2" onClick={handleClear}>Clear</button>
        <button className="btn btn-primary" onClick={handleSample} disabled={loading}>
            {loading ? 'Sampling...' : 'Sample Transactions'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="results-panel mt-4">
            <h2>Selected Sample</h2>
            <div className="result-card">
              <p><strong>Total Transactions:</strong> {result.totalTransactions}</p>
              <p><strong>Sample Size:</strong> {result.sampleSize}</p>

              <div className="mt-4">
                <table className="comparison-table w-full">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Amount (₹)</th>
                      <th>Merchant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sampledTransactions.map((t, idx) => (
                      <tr key={idx}>
                        <td>{t.transactionId}</td>
                        <td>{t.amount}</td>
                        <td>{t.merchant}</td>
                      </tr>
                    ))}
                    {result.sampledTransactions.length === 0 && (
                      <tr>
                        <td colSpan="3">No transactions sampled.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionSampling;
