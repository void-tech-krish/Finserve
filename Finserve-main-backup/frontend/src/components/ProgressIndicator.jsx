import React from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_MAP = [
  { path: '/', index: '01', total: '15', name: 'Dashboard' },
  { path: '/transaction-intelligence', index: '02', total: '15', name: 'Transaction Search' },
  { path: '/transaction-matching', index: '03', total: '15', name: 'Transaction Matching' },
  { path: '/transaction-ranking', index: '04', total: '15', name: 'Transaction Ranking' },
  { path: '/transaction-sampling', index: '05', total: '15', name: 'Transaction Sampling' },
  { path: '/fraud-detection', index: '06', total: '15', name: 'Fraud Detection' },
  { path: '/risk-coverage', index: '07', total: '15', name: 'Risk Coverage' },
  { path: '/rule-validation', index: '08', total: '15', name: 'Rule Validation' },
  { path: '/transaction-network', index: '09', total: '15', name: 'Transaction Network' },
  { path: '/case-assignment', index: '10', total: '15', name: 'Case Assignment' },
  { path: '/modules', index: '11', total: '15', name: 'Modules' },
  { path: '/algorithms', index: '12', total: '15', name: 'Algorithms' },
  { path: '/comparison', index: '13', total: '15', name: 'Comparison' },
  { path: '/analytics', index: '14', total: '15', name: 'Analytics' },
  { path: '/about', index: '15', total: '15', name: 'About' }
];

export function ProgressIndicator() {
  const location = useLocation();
  const current = ROUTE_MAP.find(r => 
    r.path === location.pathname || (r.path !== '/' && location.pathname.startsWith(r.path))
  ) || { index: '01', total: '15', name: 'Overview' };

  return (
    <div className="specimen-progress-indicator font-mono text-xs">
      <span className="progress-live-dot"></span>
      <span className="progress-numbers text-brass font-bold">{current.index} / {current.total}</span>
      <span className="progress-divider text-dim">—</span>
      <span className="progress-title text-paper">{current.name}</span>
    </div>
  );
}

export default ProgressIndicator;
