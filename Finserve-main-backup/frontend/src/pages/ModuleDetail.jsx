import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchModules } from '../services/api';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

function ModuleDetail() {
  const { id } = useParams();
  const [module, setModule] = useState(null);

  useEffect(() => {
    fetchModules().then(modules => {
      const found = modules.find(m => m.id === id);
      setModule(found);
    });
  }, [id]);

  if (!module) return <div className="page-container"><PageHeader title="Loading Telemetry..." /></div>;

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
        eyebrow={`Academic / DSA Module — ${module.id}`}
        title={`${module.id} — ${module.name}`}
        subtitle={module.description}
        meta={
          <>
            <Link to="/modules" className="text-brass hover:underline">&larr; Back to Modules</Link>
            <span>•</span>
            <span className="badge badge-info">{module.co}</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Module Telemetry & Coverage"
        description="Overall implementation coverage stats."
        tag="TELEMETRY"
        tagVariant="brass"
        watermark="01"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-ink-3 rounded border border-line">
            <span className="font-mono text-xs text-dim block">Total Algorithms</span>
            <span className="font-mono text-2xl text-paper font-bold"><CountUpNumber end={module.totalAlgorithms} /></span>
          </div>
          <div className="p-3 bg-ink-3 rounded border border-line">
            <span className="font-mono text-xs text-dim block">Implemented</span>
            <span className="font-mono text-2xl text-brass font-bold"><CountUpNumber end={module.implementedCount} /></span>
          </div>
          <div className="p-3 bg-ink-3 rounded border border-line">
            <span className="font-mono text-xs text-dim block">Coverage</span>
            <span className="font-mono text-2xl text-focus font-bold"><CountUpNumber end={module.coveragePercent} />%</span>
          </div>
        </div>
      </Plate>

      <Plate
        number={2}
        title="Required Module Algorithms"
        description="Detailed inventory of algorithms in this module."
        tag="INVENTORY"
        tagVariant="clay"
        watermark="02"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Status</th>
                <th>Complexity</th>
                <th>Source File</th>
              </tr>
            </thead>
            <tbody>
              {module.algorithms && module.algorithms.map(alg => (
                <tr key={alg.id}>
                  <td>
                    <Link to={`/algorithms/${alg.id}`} className="font-mono text-brass font-bold hover:underline">
                      {alg.name}
                    </Link>
                  </td>
                  <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                  <td className="font-mono text-clay text-xs">{alg.complexity}</td>
                  <td className="font-mono text-paper text-xs">{alg.fileClass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Plate>
    </div>
  );
}

export default ModuleDetail;
