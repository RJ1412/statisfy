import React, { useEffect, useState } from 'react';

// Polar to Cartesian conversion
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

// SVG arc path generator
const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
};

export default function MoodGauge({ score, tierLabel = "Enthusiast" }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1000;
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOut cubic
      setCurrentScore(ease * score);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [score]);

  // Determine colors based on score
  let primaryColor = '#9D71F8'; // Purist (purple)
  if (score > 33) primaryColor = '#1DB954'; // Enthusiast (green)
  if (score > 66) primaryColor = '#2EE8C7'; // Omnivore (teal)

  // Angles: 7 o'clock to 5 o'clock (210 deg to 150 deg on standard circle, but here top is 0)
  // Let's use start = -115, end = 115 (230 deg sweep)
  const startAngle = -115;
  const endAngle = 115;
  const sweep = endAngle - startAngle;
  
  // Current arc angle
  const currentAngle = startAngle + (sweep * (currentScore / 100));

  const cx = 100;
  const cy = 100;
  const r = 80;

  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
        <defs>
          <linearGradient id="gaugeBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#111120" />
          </linearGradient>
          <filter id="glowArc">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={arcPath(cx, cy, r, startAngle, endAngle)}
          fill="none"
          stroke="url(#gaugeBg)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* 3 Zone markers (decorative) */}
        {[33, 66].map(pct => {
          const a = startAngle + (sweep * (pct / 100));
          const p = polarToCartesian(cx, cy, r - 15, a);
          return <circle key={pct} cx={p.x} cy={p.y} r="1.5" fill="#3E3D55" />;
        })}

        {/* Fill arc */}
        {currentScore > 0 && (
          <path
            d={arcPath(cx, cy, r, startAngle, currentAngle)}
            fill="none"
            stroke={primaryColor}
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#glowArc)"
          />
        )}
      </svg>

      {/* Center text */}
      <div className="flex flex-col items-center justify-center mt-4">
        <span className="font-display text-[48px] font-bold leading-none text-white drop-shadow-md">
          {Math.round(currentScore)}
        </span>
        <span className="font-body text-[13px] font-medium tracking-wide mt-1" style={{ color: primaryColor }}>
          {tierLabel}
        </span>
      </div>
    </div>
  );
}
