import { useState, useEffect } from 'react';
import { fetchAlgorithms } from '../services/api';

function Viva() {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetchAlgorithms().then(setAlgorithms);
  }, []);

  const warnings = algorithms.filter(alg => alg.vivaNotes && alg.vivaNotes.length > 0);

  return (
    <div>
      <div className="page-header">
        <h1>Viva Preparation</h1>
        <p>Important warnings, limitations and questions based on the actual codebase audit.</p>
      </div>

      {warnings.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            WARNING: Implementation Limitations
          </h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {warnings.map(alg => (
              <li key={alg.id} style={{ marginBottom: '1rem' }}>
                <strong>{alg.name} ({alg.moduleId}):</strong> {alg.vivaNotes}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="stat-grid">
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>What You Can Claim</h3>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>29 out of 30</strong> algorithms are genuinely implemented from scratch in pure Java.</li>
            <li>No external graphs or optimization libraries (like JGraphT or Apache Commons Math) were used for core algorithms.</li>
            <li>Fully mathematically rigorous cross-validation (e.g. Max Flow = Min Cut verification).</li>
            <li>Advanced NP-Complete reduction mapping and parallel bounding (Brent's Theorem) are accurately modeled.</li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Potential Questions</h3>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li>What is the difference between KMP and Rabin-Karp?</li>
            <li>Why is Dinic faster than basic Ford-Fulkerson in many cases?</li>
            <li>What is the difference between Levenshtein and Damerau-Levenshtein?</li>
            <li>What is the purpose of SA-IS?</li>
            <li>What is a residual graph?</li>
            <li>Why is Vertex Cover 2-approximation called an approximation?</li>
            <li>How does Reservoir Sampling work?</li>
            <li>What are work and span in parallel algorithms?</li>
            <li>What does Brent's theorem tell us?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Viva;
