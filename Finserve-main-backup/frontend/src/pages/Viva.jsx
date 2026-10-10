import { useState, useEffect } from 'react';
import { fetchAlgorithms } from '../services/api';
import { AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

function Viva() {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetchAlgorithms().then(setAlgorithms);
  }, []);

  const warnings = algorithms.filter(alg => alg.vivaNotes && alg.vivaNotes.length > 0);

  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Academic / DSA — Examination"
        title="Viva Preparation & Audit Notes"
        subtitle="Important implementation notes, algorithmic limitations, and potential examination questions based on code audit."
        meta={
          <>
            <span>EXAM PREPARATION GUIDE</span>
            <span>•</span>
            <span>29/30 IMPLEMENTED FROM SCRATCH</span>
          </>
        }
      />

      {warnings.length > 0 && (
        <Plate
          number={1}
          title="Implementation Limitations & Nuances"
          description="Specific points to disclose in oral examination."
          tag="DISCLOSURE"
          tagVariant="sage"
          icon={AlertTriangle}
          watermark="01"
        >
          <ul className="divide-y divide-line font-mono text-xs text-sage">
            {warnings.map(alg => (
              <li key={alg.id} className="py-2.5">
                <strong className="text-paper font-bold mr-2">{alg.name} ({alg.moduleId}):</strong>
                <span>{alg.vivaNotes}</span>
              </li>
            ))}
          </ul>
        </Plate>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Plate
          number={2}
          title="What You Can Confidently Claim"
          description="Verified strengths of your Java DSA codebase."
          tag="STRENGTHS"
          tagVariant="brass"
          icon={CheckCircle2}
          watermark="02"
        >
          <ul className="space-y-3 font-mono text-xs text-paper-dim">
            <li className="flex items-start gap-2">
              <span className="text-brass font-bold">✓</span>
              <span><strong>29 out of 30</strong> algorithms are genuinely implemented from scratch in pure Java.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brass font-bold">✓</span>
              <span>No external graphs or optimization libraries (like JGraphT) were used for core algorithms.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brass font-bold">✓</span>
              <span>Fully mathematically rigorous cross-validation (e.g. Max Flow = Min Cut verification).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brass font-bold">✓</span>
              <span>Advanced NP-Complete reduction mapping and parallel bounding (Brent's Theorem) are accurately modeled.</span>
            </li>
          </ul>
        </Plate>

        <Plate
          number={3}
          title="Potential Examination Questions"
          description="Core theoretical viva questions."
          tag="QUESTIONS"
          tagVariant="focus"
          icon={HelpCircle}
          watermark="03"
        >
          <ul className="space-y-2 font-mono text-xs text-dim">
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">1. What is the difference between KMP and Rabin-Karp?</li>
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">2. Why is Dinic faster than basic Ford-Fulkerson?</li>
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">3. Levenshtein vs Damerau-Levenshtein edit distance?</li>
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">4. What is the linear time SA-IS algorithm?</li>
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">5. What is a residual graph in Network Flow?</li>
            <li className="p-2 bg-ink-3 rounded border border-line text-paper">6. Why is Vertex Cover 2-approximation bounded by 2?</li>
          </ul>
        </Plate>
      </div>
    </div>
  );
}

export default Viva;
