
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, Code2, GitCompare, Activity, AlertTriangle, Info, Search, Shuffle, Crosshair, Network, Zap } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Comparison from './pages/Comparison';
import Analytics from './pages/Analytics';
import Viva from './pages/Viva';
import TransactionIntelligence from './pages/TransactionIntelligence';
import FraudDetection from './pages/FraudDetection';
import TransactionMatching from './pages/TransactionMatching';
import TransactionNetwork from './pages/TransactionNetwork';
import CaseAssignment from './pages/CaseAssignment';
import RuleValidation from './pages/RuleValidation';
import RiskCoverage from './pages/RiskCoverage';
import TransactionRanking from './pages/TransactionRanking';
import TransactionSampling from './pages/TransactionSampling';
import About from './pages/About';
import './index.css';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path)) ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>FinServe</h2>
        <p>Banking Intelligence Platform</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="sidebar-group-title">Overview</li>
          <li><Link to="/" className={isActive('/')}><LayoutDashboard size={18} /> Dashboard</Link></li>
          
          <li className="sidebar-group-title">Transaction Intelligence</li>
          <li><Link to="/transaction-intelligence" className={isActive('/transaction-intelligence')}><Search size={18} /> Transaction Search</Link></li>
          <li><Link to="/transaction-matching" className={isActive('/transaction-matching')}><GitCompare size={18} /> Transaction Matching</Link></li>
          <li><Link to="/transaction-ranking" className={isActive('/transaction-ranking')}><Zap size={18} /> Transaction Ranking</Link></li>
          <li><Link to="/transaction-sampling" className={isActive('/transaction-sampling')}><Shuffle size={18} /> Transaction Sampling</Link></li>

          <li className="sidebar-group-title">Fraud & Risk</li>
          <li><Link to="/fraud-detection" className={isActive('/fraud-detection')}><AlertTriangle size={18} /> Fraud Detection</Link></li>
          <li><Link to="/risk-coverage" className={isActive('/risk-coverage')}><Crosshair size={18} /> Risk Coverage</Link></li>
          <li><Link to="/rule-validation" className={isActive('/rule-validation')}><Activity size={18} /> Rule Validation</Link></li>

          <li className="sidebar-group-title">Network Analytics</li>
          <li><Link to="/transaction-network" className={isActive('/transaction-network')}><Network size={18} /> Transaction Network</Link></li>
          <li><Link to="/case-assignment" className={isActive('/case-assignment')}><Layers size={18} /> Case Assignment</Link></li>

          <li className="sidebar-group-title">Academic / DSA</li>
          <li><Link to="/modules" className={isActive('/modules')}><Layers size={18} /> Modules</Link></li>
          <li><Link to="/algorithms" className={isActive('/algorithms')}><Code2 size={18} /> Algorithms</Link></li>
          <li><Link to="/comparison" className={isActive('/comparison')}><GitCompare size={18} /> Comparison</Link></li>
          <li><Link to="/analytics" className={isActive('/analytics')}><Activity size={18} /> Analytics</Link></li>
          <li><Link to="/viva" className={isActive('/viva')}><AlertTriangle size={18} /> Viva</Link></li>
          <li><Link to="/about" className={isActive('/about')}><Info size={18} /> About</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/modules/:id" element={<ModuleDetail />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/:id" element={<AlgorithmDetail />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/viva" element={<Viva />} />
            <Route path="/transaction-intelligence" element={<TransactionIntelligence />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/transaction-matching" element={<TransactionMatching />} />
            <Route path="/transaction-network" element={<TransactionNetwork />} />
            <Route path="/case-assignment" element={<CaseAssignment />} />
            <Route path="/rule-validation" element={<RuleValidation />} />
            <Route path="/risk-coverage" element={<RiskCoverage />} />
            <Route path="/transaction-ranking" element={<TransactionRanking />} />
            <Route path="/transaction-sampling" element={<TransactionSampling />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
