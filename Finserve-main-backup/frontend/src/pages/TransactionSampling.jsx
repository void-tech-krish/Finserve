import React, { useState } from 'react';
import { sampleTransactions } from '../services/api';
import { Shuffle, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

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

  const handleClear = () => { 
    setTransactions([]); 
    setSampleSize(''); 
    setResult(null); 
    setError(null); 
  };
  
  const handleSample = async () => {
    setError(null);
    setResult(null);

    const validTxns = transactions.filter(t => t.transactionId && t.amount);
    
    if (validTxns.length === 0) {
      setError('Please provide at least one valid transaction.');
      return;
    }

    const sizeNum = parseInt(sampleSize, 10);
    if (isNaN(sizeNum) || sizeNum <= 0) {
      setError('Sample size must be greater than 0.');
      return;
    }

    if (sizeNum > validTxns.length) {
      setError('Sample size cannot exceed the total number of transactions.');
      return;
    }

    let payloadTxns;
    try {
      payloadTxns = validTxns.map(t => {
        const amt = parseInt(t.amount, 10);
        if (isNaN(amt) || amt < 0) {
          throw new Error(`Invalid or negative amount for ${t.transactionId}`);
        }
        return { transactionId: t.transactionId, amount: amt, merchant: t.merchant || '' };
      });
    } catch (e) {
      setError(e.message);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        transactions: payloadTxns,
        sampleSize: sizeNum
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
      <PageHeader 
        eyebrow="Transaction Intelligence — Sampling"
        title="Reservoir Stream Sampling"
        subtitle="Select an unbiased uniform random sample of banking transactions from a stream using Algorithm R (Reservoir Sampling)."
        meta={
          <>
            <span>ALGORITHM: RESERVOIR SAMPLING</span>
            <span>•</span>
            <span>COMPLEXITY: O(N) SINGLE-PASS</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Stream Transaction Payload & Sample Size"
        description="Provide incoming stream transactions and desired sample size k."
        tag="RESERVOIR"
        tagVariant="brass"
        icon={Shuffle}
        watermark="01"
      >
        <div className="overflow-x-auto mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (₹)</th>
                <th>Merchant</th>
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
                  <td>
                    <input 
                      type="text" 
                      className="form-control"
                      value={txn.merchant} 
                      onChange={(e) => handleTransactionChange(index, 'merchant', e.target.value)} 
                      placeholder="e.g. Amazon" 
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
                  <td colSpan="4" className="text-center font-mono text-xs text-dim py-6">
                    No stream transactions added. Click "Load Example" or "+ Add Transaction Row".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-4 my-5 py-2">
          <button type="button" className="btn btn-secondary font-mono text-xs" onClick={handleAddTransaction}>
            + Add Transaction Row
          </button>
          
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs uppercase text-dim">Sample Size (k):</label>
            <input 
              type="number" 
              className="form-control font-mono"
              value={sampleSize} 
              onChange={(e) => setSampleSize(e.target.value)} 
              style={{ width: '90px' }} 
              min="1" 
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-line">
          <button className="btn btn-secondary" onClick={handleLoadExample}>Load Example</button>
          <button className="btn btn-tertiary" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleSample} disabled={loading}>
            {loading ? 'Sampling...' : 'Sample Transactions'}
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
          title="Uniform Sample Output"
          description={`Selected ${result.sampleSize} items out of ${result.totalTransactions} stream transactions.`}
          tag="SAMPLED"
          tagVariant="brass"
          watermark="02"
        >
          <div className="mb-4 font-mono text-xs text-dim flex gap-4">
            <span>Total Stream: <strong className="text-paper">{result.totalTransactions}</strong></span>
            <span>Sample Size: <strong className="text-brass">{result.sampleSize}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount (₹)</th>
                  <th>Merchant</th>
                </tr>
              </thead>
              <tbody>
                {result.sampledTransactions && result.sampledTransactions.map((t, idx) => (
                  <tr key={idx}>
                    <td className="font-mono font-semibold text-paper">{t.transactionId}</td>
                    <td className="font-mono text-brass">₹{t.amount?.toLocaleString()}</td>
                    <td className="font-mono text-dim">{t.merchant || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Plate>
      )}

      <Plate
        number={3}
        title="Why Reservoir Sampling?"
        description="Uniform probability sampling without storing full dataset in memory."
        tag="ALGORITHM THEORY"
        tagVariant="focus"
        icon={Info}
        watermark="03"
      >
        <p className="text-paper-dim text-sm">
          Reservoir Sampling randomly chooses a sample of k items from a list of n items in single O(N) time where n is either a very large or unknown number, guaranteeing equal probability for every item.
        </p>
      </Plate>
    </div>
  );
}

export default TransactionSampling;
