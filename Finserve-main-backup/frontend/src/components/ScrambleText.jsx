import React, { useState, useEffect } from 'react';

const NOISE_CHARS = '░▒▓█<>/\\|:=+*#@$%&~!?';

export function ScrambleText({ text, duration = 800, className = '' }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!text) return;
    let frame = 0;
    const fps = 30;
    const totalFrames = Math.max(15, Math.floor((duration / 1000) * fps));
    
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const solvedCount = Math.floor(text.length * progress);
      
      const scrambled = text.split('').map((char, idx) => {
        if (char === ' ' || char === '\n') return char;
        if (idx < solvedCount) return char;
        return NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
      }).join('');
      
      setDisplayText(scrambled);
      
      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [text, duration]);

  return <span className={`scramble-text ${className}`} aria-label={text}>{displayText}</span>;
}

export default ScrambleText;
