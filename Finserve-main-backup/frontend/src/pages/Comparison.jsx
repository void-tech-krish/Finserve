import { useState, useEffect } from 'react';
import { fetchAlgorithms } from '../services/api';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

function Comparison() {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetchAlgorithms().then(setAlgorithms);
  }, []);

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
        eyebrow="Academic / DSA — Audit"
        title="Project vs Required DSA Curriculum"
        subtitle="Complete source-code audit comparison mapping actual Java files to curriculum requirements."
        meta={
          <>
            <span>SOURCE CODE AUDIT MATRIX</span>
            <span>•</span>
            <span>30 ALGORITHMS TRACKED</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Curriculum vs Implementation Audit Matrix"
        description="Detailed verification mapping each required algorithm to Java source files and usage evidence."
        tag="AUDIT MATRIX"
        tagVariant="brass"
        watermark="01"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Module</th>
                <th>Required Algorithm</th>
                <th>Status</th>
                <th>Used</th>
                <th>Source File / Class</th>
                <th>Evidence Audit Note</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map(alg => (
                <tr key={alg.id}>
                  <td className="font-mono text-brass font-bold">{alg.moduleId}</td>
                  <td className="font-mono text-paper font-semibold">{alg.name}</td>
                  <td><span className={getBadgeClass(alg.status)}>{alg.status}</span></td>
                  <td className="font-mono text-xs">{alg.status.includes('USED') ? <span className="text-brass font-bold">YES</span> : <span className="text-dim">NO</span>}</td>
                  <td className="font-mono text-focus text-xs">{alg.fileClass}</td>
                  <td className="font-mono text-dim text-xs">{alg.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Plate>
    </div>
  );
}

export default Comparison;
