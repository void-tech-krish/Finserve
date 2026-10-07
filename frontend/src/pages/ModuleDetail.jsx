import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchModules } from '../services/api';

function ModuleDetail() {
  const { id } = useParams();
  const [module, setModule] = useState(null);

  useEffect(() => {
    fetchModules().then(modules => {
      const found = modules.find(m => m.id === id);
      setModule(found);
    });
  }, [id]);

  if (!module) return <div>Loading...</div>;

  const getBadgeClass = (status) => {
    if (status.includes('IMPLEMENTED & USED')) return 'badge success';
    if (status.includes('TESTED')) return 'badge info';
    if (status.includes('PARTIAL')) return 'badge warning';
    if (status.includes('MISSING')) return 'badge danger';
    return 'badge secondary';
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Link to="/modules" style={{ color: 'var(--primary)' }}>&larr; Back to Modules</Link>
        </div>
        <h1>{module.id} — {module.name}</h1>
        <p style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', fontSize: '0.875rem', marginTop: '0.5rem' }}>{module.co}</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <p>{module.description}</p>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Algorithms</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{module.totalAlgorithms}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Implemented</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{module.implementedCount}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Coverage</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{module.coveragePercent}%</div>
          </div>
        </div>
      </div>

      <h2>Required Algorithms</h2>
      <div className="card table-container" style={{ marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Status</th>
              <th>Complexity</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {module.algorithms && module.algorithms.map(alg => (
              <tr key={alg.id}>
                <td>
                  <Link to={`/algorithms/${alg.id}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    {alg.name}
                  </Link>
                </td>
                <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                <td>{alg.complexity}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{alg.fileClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModuleDetail;
