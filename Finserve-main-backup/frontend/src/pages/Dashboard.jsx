import React, { useState, useEffect, useMemo } from 'react';
import { fetchDashboard, fetchModules } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, CheckCircle2, AlertCircle, Search, 
  Activity, ShieldAlert, GitCompare, Network, 
  Layers, Crosshair, Zap, Shuffle, ChevronRight, BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

function Dashboard() {
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
    { title: 'Transaction Search', desc: 'Search transaction references with KMP & Z-Algorithm', path: '/transaction-intelligence', icon: Search, group: 'brass' },
    { title: 'Fraud Detection', desc: 'Detect suspicious multi-pattern transaction fraud', path: '/fraud-detection', icon: ShieldAlert, group: 'sage' },
    { title: 'Transaction Matching', desc: 'Compare transaction descriptions with Levenshtein', path: '/transaction-matching', icon: GitCompare, group: 'brass' },
    { title: 'Transaction Network', desc: 'Analyze transaction flow capacity with Ford-Fulkerson', path: '/transaction-network', icon: Network, group: 'clay' },
    { title: 'Case Assignment', desc: 'Assign fraud cases to analysts via Bipartite Matching', path: '/case-assignment', icon: Layers, group: 'clay' },
    { title: 'Rule Validation', desc: 'Validate banking constraints via 3-SAT Reduction', path: '/rule-validation', icon: Activity, group: 'sage' },
    { title: 'Risk Coverage', desc: 'Analyze risky relationships via Vertex Cover 2-Approx', path: '/risk-coverage', icon: Crosshair, group: 'sage' },
    { title: 'Transaction Ranking', desc: 'Rank transactions using Randomized QuickSort', path: '/transaction-ranking', icon: Zap, group: 'brass' },
    { title: 'Transaction Sampling', desc: 'Sample transaction streams with Reservoir Sampling', path: '/transaction-sampling', icon: Shuffle, group: 'brass' },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const ops = bankingOperations.filter(op => 
      op.title.toLowerCase().includes(query) || op.desc.toLowerCase().includes(query)
    ).map(op => ({ ...op, type: 'Operation' }));
    
    const mods = modules.filter(m => 
      m.id.toLowerCase().includes(query) || m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)
    ).map(m => ({ title: `${m.id} - ${m.name}`, desc: m.description, path: `/modules/${m.id}`, type: 'Module', icon: Layers }));
    
    return [...ops, ...mods];
  }, [searchQuery, modules]);

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader 
          eyebrow="Overview — System Status"
          title="FinServe Intelligence"
          subtitle="Loading kinetic telemetry..."
        />
        <div className="kpi-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="kpi-card" style={{ height: '110px' }}>
              <span className="font-mono text-xs text-dim">LOADING TELEMETRY...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Overview — Banking Platform"
        title="FinServe Intelligence"
        subtitle="Monitor transaction intelligence, fraud analysis, network risk, and DSA algorithm performance telemetry."
        meta={
          <>
            <span className="status-indicator">
              <span className={`status-dot ${error ? 'bg-danger' : 'pulsing'}`}></span>
              {error ? 'SERVICE OFFLINE' : 'SYSTEM OPERATIONAL'}
            </span>
            <span>•</span>
            <span className="badge badge-secondary font-mono">SPRING BOOT PORT: 8080</span>
          </>
        }
      >
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-dim" />
            </div>
            <input 
              type="text" 
              className="banking-input pl-10 font-mono text-sm w-full" 
              placeholder="Search tools, operations or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-ink-3 border border-line rounded shadow-2xl max-h-64 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <Link key={i} to={res.path} className="block px-4 py-3 border-b border-line hover:bg-ink-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <res.icon size={16} className="text-brass shrink-0" />
                        <span className="font-mono text-xs text-paper font-semibold">{res.title}</span>
                      </div>
                      <span className="font-mono text-xs text-dim">{res.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn btn-secondary shrink-0" 
            onClick={() => loadData(true)} 
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </PageHeader>

      {error ? (
        <div className="alert-card error mb-6 p-4 border border-sage rounded bg-ink-2 flex items-center gap-3">
          <AlertCircle size={20} className="alert-icon text-sage shrink-0" />
          <div>
            <h4 className="font-serif text-lg text-sage mb-0.5">Dashboard telemetry unavailable</h4>
            <p className="text-sm text-dim mb-0">{error}</p>
            <button className="btn btn-primary btn-sm mt-3" onClick={() => loadData()}>Retry Connection</button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI ROW */}
          <div className="kpi-grid">
            <Link to="/algorithms" className="kpi-card hover:border-brass transition-all">
              <div className="kpi-icon"><Activity size={22} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Total Algorithms</span>
                <span className="kpi-value">
                  <CountUpNumber end={stats?.totalAlgorithms || 0} />
                </span>
              </div>
            </Link>
            
            <Link to="/modules" className="kpi-card hover:border-brass transition-all">
              <div className="kpi-icon" style={{ color: 'var(--sage)' }}><Layers size={22} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Active Modules</span>
                <span className="kpi-value" style={{ color: 'var(--sage)' }}>
                  <CountUpNumber end={stats?.modules || 0} />
                </span>
              </div>
            </Link>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ color: 'var(--clay)' }}><CheckCircle2 size={22} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Implemented</span>
                <span className="kpi-value" style={{ color: 'var(--clay)' }}>
                  <CountUpNumber end={stats?.implemented || 0} />
                </span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ color: 'var(--focus)' }}><BarChart2 size={22} /></div>
              <div className="kpi-data">
                <span className="kpi-label">System Coverage</span>
                <span className="kpi-value" style={{ color: 'var(--focus)' }}>
                  <CountUpNumber end={stats?.implementationCoverage || 0} />%
                </span>
              </div>
            </div>
          </div>

          {/* BANKING OPERATIONS (Side-by-side flex row layout) */}
          <Plate
            number={1}
            title="Banking Intelligence Operations"
            description="Core production algorithms mapped to banking workflow modules."
            tag="OPERATIONAL TELEMETRY"
            tagVariant="brass"
            watermark="01"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bankingOperations.map((op, i) => (
                <Link 
                  key={i} 
                  to={op.path} 
                  className="op-card border border-line rounded-lg p-4 bg-ink-2 hover:border-brass hover:bg-ink-4 transition-all flex items-start gap-3.5 group"
                >
                  <div 
                    className="op-icon-box w-11 h-11 rounded-lg bg-ink-3 border border-line-strong text-brass shrink-0 flex items-center justify-center group-hover:border-brass group-hover:bg-brass group-hover:text-ink transition-all"
                  >
                    <op.icon size={22} />
                  </div>
                  <div className="op-content flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-mono text-sm font-bold text-paper group-hover:text-brass transition-colors truncate mb-0">
                        {op.title}
                      </h4>
                    </div>
                    <p className="text-xs text-paper-dim leading-relaxed mb-0">{op.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Plate>

          {/* MODULES & CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Plate
              number={2}
              title="DSA Module Health"
              description="Implementation status across 6 core algorithm modules."
              tag="6 MODULES"
              tagVariant="clay"
              watermark="02"
              headerAction={<Link to="/modules" className="font-mono text-xs text-brass hover:underline">View All &rarr;</Link>}
            >
              <div className="divide-y divide-line max-h-96 overflow-y-auto pr-1">
                {modules.length > 0 ? modules.map((mod, i) => (
                  <Link 
                    key={i} 
                    to={`/modules/${mod.id}`} 
                    className="flex-between py-3.5 px-3 my-1 hover:bg-ink-4 rounded-lg transition-all border border-transparent hover:border-line group"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-mono text-xs text-brass font-bold bg-ink-4 px-2 py-0.5 rounded border border-line shrink-0">{mod.id}</span>
                        <span className="font-serif text-base font-semibold text-paper group-hover:text-brass transition-colors truncate">{mod.name}</span>
                      </div>
                      <p className="font-mono text-xs text-dim mb-0">{mod.implementedCount} of {mod.totalAlgorithms} algorithms implemented</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="badge badge-success font-mono text-xs px-2.5 py-1">Available</span>
                      <ChevronRight size={18} className="text-dim group-hover:text-brass shrink-0 transition-colors" />
                    </div>
                  </Link>
                )) : (
                  <div className="p-4 text-center font-mono text-xs text-dim">No module data available</div>
                )}
              </div>
            </Plate>

            <Plate
              number={3}
              title="Algorithm Coverage Chart"
              description="Visualizing required vs implemented algorithms per module."
              tag="METRICS"
              tagVariant="focus"
              watermark="03"
            >
              <div className="flex items-center justify-center min-h-64">
                {modules.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <BarChart data={modules} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                      <XAxis dataKey="id" stroke="var(--paper-dim)" fontSize={12} tick={{ fill: 'var(--paper-dim)' }} />
                      <YAxis stroke="var(--paper-dim)" fontSize={12} tick={{ fill: 'var(--paper-dim)' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--ink-2)', borderColor: 'var(--line-strong)', borderRadius: '6px', color: 'var(--paper)' }}
                      />
                      <Bar dataKey="totalAlgorithms" name="Required" fill="var(--ink-4)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="implementedCount" name="Implemented" fill="var(--brass)" radius={[4, 4, 0, 0]}>
                        {modules.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.implementedCount === entry.totalAlgorithms ? 'var(--brass)' : 'var(--clay)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="font-mono text-xs text-dim">No chart telemetry available</div>
                )}
              </div>
            </Plate>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
