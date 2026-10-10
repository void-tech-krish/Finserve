import React from 'react';

export function DiffHighlight({ strA = '', strB = '', type = 'A' }) {
  const current = type === 'A' ? strA : strB;
  const opposite = type === 'A' ? strB : strA;

  if (!current) return <span>-</span>;

  return (
    <span className="diff-highlight-container font-mono">
      {current.split('').map((char, index) => {
        const isDiff = index >= opposite.length || char !== opposite[index];
        return isDiff ? (
          <span 
            key={index} 
            className="diff-char-changed" 
            title={`Differs from "${opposite[index] || 'EMPTY'}"`}
          >
            {char}
          </span>
        ) : (
          <span key={index} className="diff-char-same">
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default DiffHighlight;
