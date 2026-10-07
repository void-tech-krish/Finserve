import { useState, useEffect } from 'react';
import { fetchModules } from '../services/api';
import { Link } from 'react-router-dom';

function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules().then(setModules);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>DSA Modules</h1>
        <p>Overview of the 6 core FinServe curriculum modules.</p>
      </div>

      <div className="stat-grid">
        {modules.map(mod => (
          <Link to={`/modules/${mod.id}`} key={mod.id} className="card" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{mod.id}</h3>
              <span className="badge secondary">{mod.co}</span>
            </div>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: '0.5rem 0' }}>{mod.name}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{mod.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <span>Coverage</span>
              <span>{mod.coveragePercent}%</span>
            </div>
            <div className="progress-container" style={{ marginBottom: '1rem' }}>
              <div className="progress-bar" style={{ width: `${mod.coveragePercent}%` }}></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Algorithms</div>
                <div style={{ fontWeight: 'bold' }}>{mod.totalAlgorithms}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Implemented</div>
                <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{mod.implementedCount}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Used</div>
                <div style={{ fontWeight: 'bold', color: 'var(--info)' }}>{mod.usedCount}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Modules;
