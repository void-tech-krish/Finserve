import { useState, useEffect } from 'react';
import { fetchModules } from '../services/api';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';
import CountUpNumber from '../components/CountUpNumber';

function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules().then(setModules);
  }, []);

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Academic / DSA — Curriculum"
        title="DSA Algorithm Modules"
        subtitle="Overview of the 6 core FinServe data structure and algorithm curriculum modules."
        meta={
          <>
            <span>MODULES: 6 ACTIVE</span>
            <span>•</span>
            <span>TOTAL ALGORITHMS: 30</span>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, idx) => (
          <Link to={`/modules/${mod.id}`} key={mod.id}>
            <Plate
              number={idx + 1}
              title={`${mod.id} — ${mod.name}`}
              description={mod.description}
              tag={mod.co || "CO"}
              tagVariant="focus"
              watermark={mod.id}
            >
              <div className="flex justify-between items-center font-mono text-xs text-dim mb-1">
                <span>Implementation Coverage</span>
                <span className="text-brass font-bold">{mod.coveragePercent}%</span>
              </div>
              <div className="progress-container mb-4" style={{ height: '6px', background: 'var(--ink-4)' }}>
                <div className="progress-bar" style={{ width: `${mod.coveragePercent}%`, background: 'var(--brass)' }}></div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-2 border-t border-line">
                <div className="p-2 bg-ink-3 rounded border border-line">
                  <span className="text-dim block">Required</span>
                  <span className="text-paper font-bold text-sm"><CountUpNumber end={mod.totalAlgorithms} /></span>
                </div>
                <div className="p-2 bg-ink-3 rounded border border-line">
                  <span className="text-dim block">Implemented</span>
                  <span className="text-brass font-bold text-sm"><CountUpNumber end={mod.implementedCount} /></span>
                </div>
                <div className="p-2 bg-ink-3 rounded border border-line">
                  <span className="text-dim block">Used</span>
                  <span className="text-focus font-bold text-sm"><CountUpNumber end={mod.usedCount} /></span>
                </div>
              </div>
            </Plate>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Modules;
