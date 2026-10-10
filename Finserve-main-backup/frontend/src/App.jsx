import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProgressIndicator from './components/ProgressIndicator';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Comparison from './pages/Comparison';
import Analytics from './pages/Analytics';
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

function ScrollToTopAndObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Kinetic reveal-on-scroll observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll, .plate, .specimen-page-header');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTopAndObserver />
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
        <ProgressIndicator />
      </div>
    </Router>
  );
}

export default App;
