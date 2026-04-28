import React from "react";
import { motion } from "motion/react";

interface SRSGaugeProps {
  score: number;
}

export function SRSGauge({ score }: SRSGaugeProps) {
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const color = score > 85 ? "var(--color-ivannuri-neurogolf)" : score > 65 ? "var(--color-ivannuri-accent)" : score > 40 ? "var(--color-ivannuri-sub-accent)" : "var(--color-ivannuri-absolute)";
  
  const r = 44;
  const cx = 60;
  const cy = 56;
  const circumference = Math.PI * r;
  
  // Calculate endpoint for the arc
  const arcX = cx + r * Math.cos(Math.PI * (1 + pct));
  const arcY = cy + r * Math.sin(Math.PI * (1 + pct));
  
  // Larger arc flag
  const largeArcFlag = pct > 0.5 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="70" viewBox="0 0 120 70" className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        {/* Background Track */}
        <path 
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} 
          fill="none" 
          stroke="rgba(255,255,255,0.06)" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        {/* Progress Arc */}
        {pct > 0 && (
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArcFlag} 1 ${arcX} ${arcY}`} 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color} className="text-2xl font-black font-mono">
          {Math.round(score)}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.25)" className="text-[7px] font-black uppercase tracking-[0.3em]">
          SRS SCORE
        </text>
      </svg>
    </div>
  );
}
