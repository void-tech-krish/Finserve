import React, { useState, useEffect } from 'react';

export function KineticExamples({ examples = [], onLoadExample }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!examples || examples.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % examples.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [examples]);

  if (!examples || examples.length === 0) return null;

  return (
    <div className="kinetic-examples-box">
      <div className="kinetic-examples-header">
        <span className="terminal-dot"></span>
        <span className="terminal-title font-mono text-xs uppercase">Banking Example Stream</span>
        <span className="terminal-counter font-mono text-xs">[{String(activeIdx + 1).padStart(2, '0')} / {String(examples.length).padStart(2, '0')}]</span>
      </div>
      <div className="kinetic-examples-list">
        {examples.map((ex, idx) => {
          const isActive = idx === activeIdx;
          const pair = Array.isArray(ex) ? ex : [ex.a, ex.b];
          return (
            <div 
              key={idx} 
              className={`kinetic-example-item ${isActive ? 'active' : ''}`}
              onClick={() => onLoadExample && onLoadExample(pair[0], pair[1])}
              role="button"
              tabIndex={0}
            >
              <span className="example-marker font-mono">{isActive ? '▶' : '◇'}</span>
              <span className="example-str font-mono">{pair[0]}</span>
              <span className="example-vs font-mono text-dim">vs</span>
              <span className="example-str font-mono">{pair[1]}</span>
              {isActive && <span className="example-action-badge font-mono text-xs">CLICK TO TEST</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KineticExamples;
