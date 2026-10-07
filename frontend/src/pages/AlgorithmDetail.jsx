import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlgorithms } from '../services/api';

function AlgorithmDetail() {
  const { id } = useParams();
  const [alg, setAlg] = useState(null);

  useEffect(() => {
    fetchAlgorithms().then(algs => {
      const found = algs.find(a => a.id === id);
      setAlg(found);
    });
  }, [id]);

  if (!alg) return <div>Loading...</div>;

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
          <Link to="/algorithms" style={{ color: 'var(--primary)' }}>&larr; Back to Algorithms</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0 }}>{alg.name}</h1>
          <span className={getBadgeClass(alg.status)}>{alg.status}</span>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>Module:</div>
            <div>
              <Link to={`/modules/${alg.moduleId}`} className="badge info">{alg.moduleId}</Link>
            </div>
            
            <div style={{ color: 'var(--text-muted)' }}>File:</div>
            <div style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{alg.fileClass}</div>
            
            <div style={{ color: 'var(--text-muted)' }}>Used By:</div>
            <div>{alg.usedBy}</div>
            
            <div style={{ color: 'var(--text-muted)' }}>Purpose:</div>
            <div>{alg.purpose}</div>
            
            <div style={{ color: 'var(--text-muted)' }}>Complexity:</div>
            <div style={{ fontFamily: 'monospace' }}>{alg.complexity}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem' }}>FinServe Use Case</h3>
          <p>{alg.finserveUseCase}</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Implementation Evidence</h3>
        <p style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid var(--primary)' }}>
          {alg.evidence}
        </p>
      </div>

      {alg.vivaNotes && (
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Viva Notes</h3>
          <p>{alg.vivaNotes}</p>
        </div>
      )}
    </div>
  );
}

export default AlgorithmDetail;
