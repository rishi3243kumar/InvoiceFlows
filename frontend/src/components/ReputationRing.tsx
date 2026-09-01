'use client';

import { useEffect, useState } from 'react';

interface ReputationRingProps {
  score: number; // 0 to 100
  size?: number;
}

export default function ReputationRing({ score, size = 60 }: ReputationRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let color = 'var(--primary-cyan)';
  let glow = 'var(--cyan-glow)';
  if (score < 60) {
    color = '#ef4444';
    glow = 'rgba(239, 68, 68, 0.4)';
  } else if (score < 85) {
    color = 'var(--glowing-gold)';
    glow = 'var(--gold-glow)';
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="4"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 4px ${glow})`
          }}
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'Share Tech Mono, monospace', color }}>
        {animatedScore}%
      </div>
    </div>
  );
}
