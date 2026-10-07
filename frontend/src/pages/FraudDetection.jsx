import { useState } from 'react';
import { detectFraud } from '../services/api';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Search } from 'lucide-react';

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
  const handleClear = () => { setTransactionText(''); setPatternsText(''); setResult(null); setError(null); };
  
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
    <div className="page-container banking-theme">
      <header className="banking-header">
        <div className="header-content">
          <div>
            <h1>Fraud Detection</h1>
            <p className="subtitle">Detect suspicious transaction patterns using multi-pattern matching.</p>
          </div>
          <div className="status-indicator">
            <span className="status-dot pulsing"></span>
            <span className="status-text">Fraud Analysis Ready</span>
          </div>
        </div>
      </header>

      <div className="banking-card mb-6">
        <div className="card-header">
          <h2><ShieldAlert size={20} className="inline mr-2 text-primary" /> Fraud Pattern Analysis</h2>
          <p className="text-sm text-muted mt-1">Scan transaction descriptions against multiple known fraud indicators simultaneously.</p>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Transaction Description / Transaction Text</label>
              <div className="input-wrapper">
                <textarea 
                  className="banking-textarea"
                  value={transactionText} 
                  onChange={e => setTransactionText(e.target.value)}
                  placeholder="e.g. TRANSFER TO UNKNOWN ACCOUNT REF-9281 URGENT CASH WITHDRAWAL"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>
                Fraud Patterns
                <span className="text-muted text-sm ml-2 font-normal">(Enter one suspicious pattern per line.)</span>
              </label>
              <div className="input-wrapper">
                <textarea 
                  className="banking-textarea"
                  value={patternsText} 
                  onChange={e => setPatternsText(e.target.value)}
                  placeholder="UNKNOWN ACCOUNT&#10;URGENT&#10;CASH WITHDRAWAL"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <div className="text-danger text-sm mt-2 flex items-center">
              <AlertTriangle size={14} className="mr-1" /> {validationError}
            </div>
          )}

          <div className="action-row mt-6">
            
        <div className="flex gap-2 w-full">
            <button className="btn btn-secondary flex-1" onClick={handleLoadExample}>Load Example</button>
            <button className="btn btn-tertiary flex-1" onClick={handleClear}>Clear</button>
            <button className="btn btn-primary btn-large flex-1" style={{flex: 2}} onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <><span className="spinner"></span> Analyzing...</>
              ) : (
                <><Search size={18} /> Analyze Transaction</>
              )}
            </button>
        </div>
            <div className="text-center mt-2">
              <span className="text-xs text-muted">Powered by Aho-Corasick multi-pattern matching</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-card error mb-6">
          <AlertTriangle size={20} className="alert-icon" />
          <div className="alert-content">
            <h4>Analysis Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="content-grid two-columns result-card-animated mb-6">
          <div className="main-column">
            <div className="banking-card h-full">
              <div className={`card-header ${result.fraudDetected ? 'bg-danger-subtle' : 'bg-success-subtle'}`}>
                <h2 className={`flex items-center ${result.fraudDetected ? 'text-danger' : 'text-success'}`}>
                  {result.fraudDetected ? <AlertTriangle size={20} className="mr-2" /> : <CheckCircle2 size={20} className="mr-2" />}
                  {result.fraudDetected ? 'Detected Indicators' : 'No Fraud Indicators Detected'}
                </h2>
              </div>
              <div className="card-body p-0">
                {result.fraudDetected ? (
                  <ul className="fraud-list">
                    {result.matchedPatterns.map((match, idx) => (
                      <li key={idx} className="fraud-list-item">
                        <div className="flex items-start">
                          <AlertTriangle size={16} className="text-danger mt-1 mr-3" />
                          <div>
                            <strong className="text-danger uppercase">{match.pattern}</strong>
                            <p className="text-sm text-muted mb-0">Found in transaction description (position {match.position})</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-state p-8 text-center">
                    <CheckCircle2 size={48} className="text-success mx-auto mb-3 opacity-80" />
                    <h3 className="text-success">✓ No suspicious patterns detected</h3>
                    <p className="text-muted text-sm">Transaction appears safe based on current pattern library.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="side-column">
            <div className="banking-card h-full flex flex-col">
              <div className="card-header">
                <h2>Fraud Analysis Result</h2>
              </div>
              <div className="card-body flex-1 flex flex-col">
                <div className="kpi-grid single-col mb-4">
                  <div className="kpi-card !p-4 !mb-0">
                    <div className="kpi-data w-full flex-between">
                      <span className="kpi-label">Patterns Checked</span>
                      <span className="kpi-value text-xl">{result.patternsChecked}</span>
                    </div>
                  </div>
                  <div className="kpi-card !p-4 !mb-0">
                    <div className="kpi-data w-full flex-between">
                      <span className="kpi-label">Matches Found</span>
                      <span className={`kpi-value text-xl ${result.matchCount > 0 ? 'text-danger' : 'text-success'}`}>
                        {result.matchCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="result-metric-large mt-4 !bg-transparent border border-b-border !p-4">
                  <span className="metric-label">Risk Status</span>
                  <span className={`metric-value text-2xl ${result.fraudDetected ? 'text-danger' : 'text-success'}`}>
                    {result.fraudDetected ? 'High Risk' : 'Low Risk'}
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-b-border">
                  <div className="detail-row !border-none !pb-1">
                    <span className="detail-label text-xs">Algorithm</span>
                    <span className="detail-value text-xs font-mono">{result.algorithm}</span>
                  </div>
                  {result.complexity && (
                    <div className="detail-row !border-none !py-1">
                      <span className="detail-label text-xs">Complexity</span>
                      <span className="detail-value text-xs font-mono">{result.complexity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="banking-card info-card bg-primary-subtle border-primary-light mt-6">
        <div className="card-body">
          <h3 className="flex items-center text-primary mb-3">
            <Info size={18} className="mr-2" /> Why Aho-Corasick?
          </h3>
          <p className="text-sm text-muted mb-4">
            It can search for multiple patterns simultaneously in a transaction description, making it useful for checking many known fraud indicators at once.
          </p>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div className="info-item">
              <h4 className="text-sm font-semibold text-primary mb-1">Multi-pattern Search</h4>
              <p className="text-xs text-muted">Search multiple indicators in one pass.</p>
            </div>
            <div className="info-item">
              <h4 className="text-sm font-semibold text-primary mb-1">Fraud Indicators</h4>
              <p className="text-xs text-muted">Check transaction descriptions against known patterns.</p>
            </div>
            <div className="info-item">
              <h4 className="text-sm font-semibold text-primary mb-1">Efficient Matching</h4>
              <p className="text-xs text-muted">Avoid repeatedly scanning the description for every pattern.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
