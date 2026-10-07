import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlgorithms } from '../services/api';

function Algorithms() {
  const [algorithms, setAlgorithms] = useState([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAlgorithms().then(setAlgorithms);
  }, []);

  const filtered = algorithms.filter(alg => {
    const matchesSearch = alg.name.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'All' || alg.moduleId === moduleFilter;
    const matchesStatus = statusFilter === 'All' || alg.status === statusFilter;
    return matchesSearch && matchesModule && matchesStatus;
  });

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
        <h1>Algorithms Directory</h1>
        <p>Browse and search through all DSA algorithms in FinServe.</p>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search algorithm..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', flex: 1 }}
        />
        <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}>
          <option value="All">All Modules</option>
          {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}>
          <option value="All">All Statuses</option>
          <option value="IMPLEMENTED & USED">Implemented & Used</option>
          <option value="IMPLEMENTED & TESTED">Implemented & Tested</option>
          <option value="PARTIAL">Partial</option>
          <option value="DOCUMENTATION ONLY">Documentation Only</option>
          <option value="MISSING">Missing</option>
        </select>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Module</th>
              <th>Category</th>
              <th>Status</th>
              <th>Complexity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(alg => (
              <tr key={alg.id}>
                <td>
                  <Link to={`/algorithms/${alg.id}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    {alg.name}
                  </Link>
                </td>
                <td>{alg.moduleId}</td>
                <td>{alg.purpose}</td>
                <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                <td>{alg.complexity}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No algorithms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Algorithms;
