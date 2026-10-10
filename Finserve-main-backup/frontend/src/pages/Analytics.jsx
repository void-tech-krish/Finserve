import { useState, useEffect } from 'react';
import { fetchDashboard, fetchModules } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchDashboard().then(setStats);
    fetchModules().then(setModules);
  }, []);

  if (!stats) return <div className="page-container"><PageHeader title="Loading Telemetry..." /></div>;

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
  const COLORS = ['#7fc4a8', '#e0a15c', '#e8836b'];

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Academic / DSA — Analytics"
        title="Coverage Analytics"
        subtitle="Visual analytics telemetry overview of project implementation and algorithm usage coverage."
        meta={
          <>
            <span>IMPLEMENTATION: {stats.implementationCoverage}%</span>
            <span>•</span>
            <span>USAGE: {stats.usageCoverage}%</span>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Plate
          number={1}
          title="Overall Implementation Coverage"
          description="Percentage of required curriculum algorithms implemented."
          tag="IMPLEMENTATION"
          tagVariant="brass"
          watermark="01"
        >
          <div className="font-serif text-5xl font-bold text-brass mb-2">
            <CountUpNumber end={stats.implementationCoverage} />%
          </div>
          <div className="font-mono text-xs text-dim">
            <CountUpNumber end={stats.implemented} /> / {stats.totalAlgorithms} Algorithms Implemented
          </div>
        </Plate>

        <Plate
          number={2}
          title="Project Usage Coverage"
          description="Algorithms wired into live banking intelligence workflows."
          tag="USAGE"
          tagVariant="focus"
          watermark="02"
        >
          <div className="font-serif text-5xl font-bold text-focus mb-2">
            <CountUpNumber end={stats.usageCoverage} />%
          </div>
          <div className="font-mono text-xs text-dim">
            <CountUpNumber end={stats.used} /> / {stats.totalAlgorithms} Algorithms Active in Workflows
          </div>
        </Plate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Plate
          number={3}
          title="Module Implementation Breakdown"
          description="Bar telemetry chart by module ID."
          tag="MODULE BREAKDOWN"
          tagVariant="clay"
          watermark="03"
        >
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis dataKey="name" stroke="var(--paper-dim)" fontSize={12} tick={{ fill: 'var(--paper-dim)' }} />
                <YAxis stroke="var(--paper-dim)" fontSize={12} tick={{ fill: 'var(--paper-dim)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--ink-2)', borderColor: 'var(--line-strong)', borderRadius: '4px', color: 'var(--paper)' }} />
                <Bar dataKey="implemented" fill="var(--brass)" name="Implemented" radius={[4,4,0,0]} />
                <Bar dataKey="required" fill="var(--ink-4)" name="Required" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Plate>

        <Plate
          number={4}
          title="Status Distribution"
          description="Proportional breakdown of algorithm status."
          tag="DISTRIBUTION"
          tagVariant="sage"
          watermark="04"
        >
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--ink-2)', borderColor: 'var(--line-strong)', borderRadius: '4px', color: 'var(--paper)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 font-mono text-xs">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '50%' }}></div>
                <span className="text-dim">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </Plate>
      </div>
    </div>
  );
}

export default Analytics;
