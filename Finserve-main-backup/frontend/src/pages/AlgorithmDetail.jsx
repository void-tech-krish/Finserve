import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlgorithms } from '../services/api';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

function AlgorithmDetail() {
  const { id } = useParams();
  const [alg, setAlg] = useState(null);

  useEffect(() => {
    fetchAlgorithms().then(algs => {
      const found = algs.find(a => a.id === id);
      setAlg(found);
    });
  }, [id]);

  if (!alg) {
    return (
      <div className="page-container">
        <PageHeader title="Loading Telemetry..." />
      </div>
    );
  }

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
        eyebrow={`Academic / DSA — ${alg.moduleId}`}
        title={alg.name}
        subtitle={alg.purpose}
        meta={
          <>
            <Link to="/algorithms" className="text-brass hover:underline">&larr; Back to Algorithms</Link>
            <span>•</span>
            <span className={getBadgeClass(alg.status)}>{alg.status}</span>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Plate
            number={1}
            title="Algorithm Specifications & Metadata"
            description="Technical parameters and code mapping."
            tag={alg.moduleId}
            tagVariant="brass"
            watermark="01"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-ink-3 rounded border border-line">
                <span className="text-dim block mb-1">Module ID</span>
                <Link to={`/modules/${alg.moduleId}`} className="text-brass font-bold">{alg.moduleId}</Link>
              </div>
              <div className="p-3 bg-ink-3 rounded border border-line">
                <span className="text-dim block mb-1">Source File</span>
                <span className="text-paper font-bold">{alg.fileClass}</span>
              </div>
              <div className="p-3 bg-ink-3 rounded border border-line">
                <span className="text-dim block mb-1">Complexity</span>
                <span className="text-clay font-bold">{alg.complexity}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-ink-3 rounded border border-line">
              <span className="font-mono text-xs text-dim uppercase block mb-1">Used By Component:</span>
              <span className="font-mono text-sm text-paper font-semibold">{alg.usedBy}</span>
            </div>
          </Plate>
        </div>

        <div>
          <Plate
            number={2}
            title="FinServe Use Case"
            description="Production banking utility."
            tag="USE CASE"
            tagVariant="clay"
            watermark="02"
          >
            <p className="text-paper text-sm">{alg.finserveUseCase}</p>
          </Plate>
        </div>
      </div>

      <Plate
        number={3}
        title="Implementation Evidence"
        description="Verification audit notes."
        tag="EVIDENCE"
        tagVariant="focus"
        watermark="03"
      >
        <div className="p-4 bg-ink-3 rounded border-l-4 border-brass font-mono text-xs text-paper">
          {alg.evidence}
        </div>
      </Plate>
    </div>
  );
}

export default AlgorithmDetail;
