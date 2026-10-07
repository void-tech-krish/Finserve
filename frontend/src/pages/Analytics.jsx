import { useState, useEffect } from 'react';
import { fetchDashboard, fetchModules } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchDashboard().then(setStats);
    fetchModules().then(setModules);
  }, []);

  if (!stats) return <div>Loading...</div>;

  const chartData = modules.map(m => ({
    name: m.id,
    implemented: m.implementedCount,
    required: m.totalAlgorithms
  }));

  const pieData = [
    { name: 'Implemented & Used', value: stats.used },
    { name: 'Partial', value: 1 },
    { name: 'Missing', value: 0 }
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div>
      <div className="page-header">
        <h1>Coverage Analytics</h1>
        <p>Visual overview of project implementation and usage coverage.</p>
      </div>

      <div className="stat-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Overall Implementation</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.implementationCoverage}%</div>
          <div style={{ marginTop: '0.5rem' }}>{stats.implemented} / {stats.totalAlgorithms} Algorithms</div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Project Usage Coverage</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--info)' }}>{stats.usageCoverage}%</div>
          <div style={{ marginTop: '0.5rem' }}>{stats.used} / {stats.totalAlgorithms} Algorithms</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Module Coverage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Bar dataKey="implemented" fill="#2563eb" name="Implemented" />
              <Bar dataKey="required" fill="#334155" name="Required" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            {pieData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
