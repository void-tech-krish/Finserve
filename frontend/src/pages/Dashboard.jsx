import { useState, useEffect } from 'react';
import { fetchDashboard, fetchModules } from '../services/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchDashboard().then(setStats);
    fetchModules().then(setModules);
  }, []);

  if (!stats) return <div className="page-header">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>DSA Algorithm Intelligence</h1>
        <p>Analyze, compare and verify algorithm coverage across the FinServe banking analytics platform.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Link to="/algorithms" className="badge info" style={{ padding: '0.5rem 1rem' }}>Explore Algorithms</Link>
          <Link to="/modules" className="badge success" style={{ padding: '0.5rem 1rem' }}>View Module Coverage</Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalAlgorithms}</div>
          <div className="stat-label">Required Algorithms</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.implemented}</div>
          <div className="stat-label">Implemented</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.implementationCoverage}%</div>
          <div className="stat-label">Implementation Coverage</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.usageCoverage}%</div>
          <div className="stat-label">Project Usage Coverage</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.modules}</div>
          <div className="stat-label">DSA Modules</div>
        </div>
      </div>

      <h2>Module Coverage</h2>
      <div className="stat-grid" style={{ marginTop: '1rem' }}>
        {modules.map(mod => (
          <Link to={`/modules/${mod.id}`} key={mod.id} className="card" style={{ display: 'block' }}>
            <h3>{mod.id}</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{mod.name}</p>
            <div style={{ margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Implemented: {mod.implementedCount}/{mod.totalAlgorithms}</span>
                <span>{mod.coveragePercent}%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${mod.coveragePercent}%` }}></div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Used: {mod.usedCount}/{mod.totalAlgorithms}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
