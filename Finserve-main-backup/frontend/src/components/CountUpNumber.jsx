import React, { useState, useEffect } from 'react';

export function CountUpNumber({ end, duration = 800, className = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(end);
    if (isNaN(target)) {
      setCount(end);
      return;
    }
    
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * target);
      setCount(currentVal);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className={`kinetic-number ${className}`}>{count}</span>;
}

export default CountUpNumber;
