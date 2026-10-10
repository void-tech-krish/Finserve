import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import ScrambleText from './ScrambleText';
import CountUpNumber from './CountUpNumber';
import DiffHighlight from './DiffHighlight';

export function ResultCard({ result }) {
  if (!result) return null;

  const isMatched = result.matched;
  const statusColor = isMatched ? 'var(--brass)' : 'var(--sage)';
  const verdictText = isMatched ? 'LIKELY MATCH' : 'DIFFERENT / NO MATCH';
  const Icon = isMatched ? CheckCircle2 : XCircle;

  return (
    <div className={`specimen-result-card ${isMatched ? 'matched' : 'unmatched'} plate mt-6 p-6 rounded-md`}>
      <div className="result-header flex-between flex-wrap gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="status-icon-wrapper p-2 rounded-full" style={{ background: `color-mix(in srgb, ${statusColor} 15%, transparent)`, color: statusColor }}>
            <Icon size={28} />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-dim block">Verdict Output</span>
            <h3 className="result-verdict font-serif text-2xl font-bold italic" style={{ color: statusColor }}>
              <ScrambleText text={verdictText} duration={700} />
            </h3>
          </div>
        </div>
        <div className="result-badge font-mono text-xs uppercase px-3 py-1 rounded-full border" style={{ borderColor: statusColor, color: statusColor, background: `color-mix(in srgb, ${statusColor} 10%, transparent)` }}>
          {isMatched ? 'MATCH CONFIRMED' : 'DIVERGENCE DETECTED'}
        </div>
      </div>

      <div className="result-metrics-grid grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="metric-box p-4 rounded bg-ink-3 border border-line">
          <span className="metric-label font-mono text-xs uppercase text-dim block mb-1">Edit Distance</span>
          <span className="metric-value font-serif text-3xl font-bold text-brass">
            <CountUpNumber end={result.distance ?? 0} duration={800} />
          </span>
        </div>

        <div className="metric-box p-4 rounded bg-ink-3 border border-line">
          <span className="metric-label font-mono text-xs uppercase text-dim block mb-1">Algorithm</span>
          <span className="metric-value font-mono text-base font-semibold text-paper capitalize">
            {result.algorithm || 'Levenshtein'}
          </span>
        </div>

        <div className="metric-box p-4 rounded bg-ink-3 border border-line">
          <span className="metric-label font-mono text-xs uppercase text-dim block mb-1">Matching Threshold</span>
          <span className="metric-value font-mono text-base font-semibold text-clay">
            &le; 2 edits
          </span>
        </div>
      </div>

      <div className="result-diff-box p-4 rounded bg-ink-3 border border-line">
        <span className="diff-box-title font-mono text-xs uppercase tracking-wider text-brass block mb-3">
          Staggered Character Diff Analysis
        </span>
        <div className="space-y-2">
          <div className="diff-row flex items-center justify-between text-sm py-1 border-b border-line">
            <span className="font-mono text-xs text-dim w-32">Transaction A:</span>
            <span className="font-mono text-paper font-medium flex-1">
              <DiffHighlight strA={result.transactionA} strB={result.transactionB} type="A" />
            </span>
          </div>
          <div className="diff-row flex items-center justify-between text-sm py-1">
            <span className="font-mono text-xs text-dim w-32">Transaction B:</span>
            <span className="font-mono text-paper font-medium flex-1">
              <DiffHighlight strA={result.transactionA} strB={result.transactionB} type="B" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
