import { useState, useEffect } from 'react';
import { fetchAlgorithms } from '../services/api';

function Comparison() {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetchAlgorithms().then(setAlgorithms);
  }, []);

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
        <h1>Project vs Required DSA Curriculum</h1>
        <p>Complete source-code audit comparison mapping actual files to curriculum requirements.</p>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Required Algorithm</th>
              <th>Status</th>
              <th>Actually Used</th>
              <th>File / Class</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map(alg => (
              <tr key={alg.id}>
                <td style={{ fontWeight: 'bold' }}>{alg.moduleId}</td>
                <td style={{ color: 'var(--text-main)' }}>{alg.name}</td>
                <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                <td>{alg.status.includes('USED') ? <span style={{ color: 'var(--success)' }}>YES</span> : 'NO'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--info)' }}>{alg.fileClass}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{alg.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Comparison;
