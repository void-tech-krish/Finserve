import React, { useState, useEffect, useMemo } from 'react';
import { fetchDashboard, fetchModules } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RefreshCw, CheckCircle2, AlertCircle, Search, 
  Activity, ShieldAlert, GitCompare, Network, 
  Layers, Crosshair, Zap, Shuffle, ChevronRight, BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const [dashboardData, modulesData] = await Promise.all([
        fetchDashboard(),
        fetchModules()
      ]);
      setStats(dashboardData);
      setModules(modulesData);
    } catch (err) {
      setError('Unable to connect to the analytics service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const bankingOperations = [
    { title: 'Transaction Search', desc: 'Search transaction references', path: '/transaction-intelligence', icon: Search },
    { title: 'Fraud Detection', desc: 'Detect suspicious patterns', path: '/fraud-detection', icon: ShieldAlert },
    { title: 'Transaction Matching', desc: 'Compare transaction descriptions', path: '/transaction-matching', icon: GitCompare },
    { title: 'Transaction Network', desc: 'Analyze transaction flow capacity', path: '/transaction-network', icon: Network },
    { title: 'Case Assignment', desc: 'Assign fraud cases to analysts', path: '/case-assignment', icon: Layers },
    { title: 'Rule Validation', desc: 'Validate banking constraints', path: '/rule-validation', icon: Activity },
    { title: 'Risk Coverage', desc: 'Analyze risky relationships', path: '/risk-coverage', icon: Crosshair },
    { title: 'Transaction Ranking', desc: 'Rank using randomized quicksort', path: '/transaction-ranking', icon: Zap },
    { title: 'Transaction Sampling', desc: 'Sample transaction streams', path: '/transaction-sampling', icon: Shuffle },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    // Search operations
    const ops = bankingOperations.filter(op => 
      op.title.toLowerCase().includes(query) || op.desc.toLowerCase().includes(query)
    ).map(op => ({ ...op, type: 'Operation' }));
    
    // Search modules
    const mods = modules.filter(m => 
      m.id.toLowerCase().includes(query) || m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)
    ).map(m => ({ title: `${m.id} - ${m.name}`, desc: m.description, path: `/modules/${m.id}`, type: 'Module', icon: Layers }));
    
    return [...ops, ...mods];
  }, [searchQuery, modules]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="kpi-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="kpi-card" style={{ height: '100px' }}>
              <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header flex-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">FinServe Banking Intelligence</h1>
          <p className="text-muted text-sm">Monitor transaction intelligence, fraud analysis, network risk and algorithm performance.</p>
          
          <div className="mt-3 flex items-center">
            <span className={`status-indicator ${error ? 'border-danger text-danger' : 'border-success text-success'}`}>
              <span className={`status-dot ${error ? 'bg-danger' : 'pulsing'}`}></span>
              {error ? 'Service Unavailable' : 'System Operational'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-muted" />
            </div>
            <input 
              type="text" 
              className="banking-input pl-10" 
              placeholder="Search tools or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '250px' }}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <Link key={i} to={res.path} className="block px-4 py-3 border-b border-border hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <res.icon size={16} className="text-primary mr-2" />
                        <span className="font-semibold text-sm text-primary">{res.title}</span>
                      </div>
                      <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded">{res.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => loadData(true)} 
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      {error ? (
        <div className="alert-card error mb-6">
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-content">
            <h4>Dashboard data unavailable</h4>
            <p>{error}</p>
            <button className="btn btn-primary btn-sm mt-3" onClick={() => loadData()}>Retry Connection</button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI ROW */}
          <div className="kpi-grid">
            <Link to="/algorithms" className="kpi-card hover:border-primary transition-colors cursor-pointer">
              <div className="kpi-icon bg-primary-subtle text-primary"><Activity size={24} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Total Algorithms</span>
                <span className="kpi-value">{stats?.totalAlgorithms || '0'}</span>
              </div>
            </Link>
            
            <Link to="/modules" className="kpi-card hover:border-primary transition-colors cursor-pointer">
              <div className="kpi-icon bg-success-subtle text-success"><Layers size={24} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Active Modules</span>
                <span className="kpi-value">{stats?.modules || '0'}</span>
              </div>
            </Link>

            <div className="kpi-card">
              <div className="kpi-icon bg-warning-subtle text-warning"><CheckCircle2 size={24} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Implemented</span>
                <span className="kpi-value">{stats?.implemented || '0'}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon bg-info-subtle text-info"><BarChart2 size={24} /></div>
              <div className="kpi-data">
                <span className="kpi-label">System Coverage</span>
                <span className="kpi-value">{stats?.implementationCoverage || '0'}%</span>
              </div>
            </div>
          </div>

          {/* BANKING OPERATIONS */}
          <div className="banking-card mb-8">
            <div className="card-header">
              <h2>Banking Operations</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankingOperations.map((op, i) => (
                  <Link key={i} to={op.path} className="border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all flex items-start group">
                    <div className="bg-gray-100 p-2 rounded-lg text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <op.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary text-sm mb-1">{op.title}</h4>
                      <p className="text-xs text-muted">{op.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* MODULES & CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="banking-card h-full">
              <div className="card-header flex-between">
                <h2>DSA Module Health</h2>
                <Link to="/modules" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="card-body p-0">
                <div className="overflow-y-auto max-h-96">
                  {modules.length > 0 ? modules.map((mod, i) => (
                    <Link key={i} to={`/modules/${mod.id}`} className="flex-between p-4 border-b border-border hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">{mod.id}</span>
                          <span className="text-sm font-medium text-text-primary">{mod.name}</span>
                        </div>
                        <p className="text-xs text-muted">{mod.implementedCount} of {mod.totalAlgorithms} algorithms implemented</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="badge badge-success mb-2">Available</span>
                        <ChevronRight size={16} className="text-muted" />
                      </div>
                    </Link>
                  )) : (
                    <div className="p-8 text-center text-muted">No module data available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="banking-card h-full">
              <div className="card-header">
                <h2>Algorithm Coverage Chart</h2>
              </div>
              <div className="card-body flex items-center justify-center" style={{ minHeight: '300px' }}>
                {modules.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={modules} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <XAxis dataKey="id" stroke="#627D98" fontSize={12} />
                      <YAxis stroke="#627D98" fontSize={12} />
                      <Tooltip 
                        cursor={{fill: 'rgba(11, 94, 215, 0.05)'}}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #D9E2EC' }}
                      />
                      <Bar dataKey="totalAlgorithms" name="Required" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="implementedCount" name="Implemented" fill="#0B5ED7" radius={[4, 4, 0, 0]}>
                        {modules.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.implementedCount === entry.totalAlgorithms ? '#16845B' : '#0B5ED7'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted">No chart data available</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
