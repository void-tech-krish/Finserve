import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAlgorithms } from '../services/api';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

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
    <div className="page-container">
      <PageHeader 
        eyebrow="Academic / DSA — Catalog"
        title="Algorithms Directory"
        subtitle="Browse and search through all data structures and algorithms in the FinServe platform."
        meta={
          <>
            <span>30 ALGORITHMS</span>
            <span>•</span>
            <span>6 CURRICULUM MODULES</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Filter Algorithm Catalog"
        description="Filter by module, search keyword, or implementation status."
        tag="DIRECTORY"
        tagVariant="brass"
        watermark="01"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input 
            type="text" 
            className="form-control"
            placeholder="Search algorithm name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="form-control" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
            <option value="All">All Modules</option>
            {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="IMPLEMENTED & USED">Implemented & Used</option>
            <option value="IMPLEMENTED & TESTED">Implemented & Tested</option>
            <option value="PARTIAL">Partial</option>
            <option value="DOCUMENTATION ONLY">Documentation Only</option>
            <option value="MISSING">Missing</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Module</th>
                <th>Category / Purpose</th>
                <th>Status</th>
                <th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(alg => (
                <tr key={alg.id}>
                  <td>
                    <Link to={`/algorithms/${alg.id}`} className="font-mono text-brass font-bold hover:underline">
                      {alg.name}
                    </Link>
                  </td>
                  <td className="font-mono text-paper font-semibold">{alg.moduleId}</td>
                  <td className="font-mono text-dim text-xs">{alg.purpose}</td>
                  <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                  <td className="font-mono text-clay text-xs">{alg.complexity}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center font-mono text-xs text-dim py-8">
                    No algorithms matched current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Plate>
    </div>
  );
}

export default Algorithms;
