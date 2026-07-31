import React, { useState, useEffect } from 'react';

interface MacroRingsProps {
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
  calories: { current: number; target: number };
  size?: number;
}

export function MacroRings({
  protein,
  carbs,
  fat,
  calories,
  size = 240,
}: MacroRingsProps) {
  // Staggered entry animation states
  const [isMounted, setIsMounted] = useState(false);

  // Counting up animation states for smooth numbers transition on load
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [animatedRemaining, setAnimatedRemaining] = useState(calories.target || 2000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calRemaining = Math.max(0, calories.target - calories.current);
  const calPercent = Math.min(100, Math.max(0, (calories.current / (calories.target || 1)) * 100));

  // Center coordinates and math for nested rings
  const center = size / 2;
  const strokeWidth = 12;
  const gap = 6;

  // Ring Radii
  const rProtein = (size / 2) - strokeWidth - 5;
  const rCarbs = rProtein - strokeWidth - gap;
  const rFat = rCarbs - strokeWidth - gap;

  // Circumference = 2 * PI * r
  const cProtein = 2 * Math.PI * rProtein;
  const cCarbs = 2 * Math.PI * rCarbs;
  const cFat = 2 * Math.PI * rFat;

  // Percentage calculations capped at 100% for physical rendering
  const pctProtein = Math.min(100, Math.max(0, (protein.current / (protein.target || 1)) * 100));
  const pctCarbs = Math.min(100, Math.max(0, (carbs.current / (carbs.target || 1)) * 100));
  const pctFat = Math.min(100, Math.max(0, (fat.current / (fat.target || 1)) * 100));

  // Stroke offsets triggered by the isMounted animation state
  const offsetProtein = isMounted ? cProtein - (pctProtein * cProtein) / 100 : cProtein;
  const offsetCarbs = isMounted ? cCarbs - (pctCarbs * cCarbs) / 100 : cCarbs;
  const offsetFat = isMounted ? cFat - (pctFat * cFat) / 100 : cFat;

  return (
    <div className="flex flex-col items-center justify-center select-none" id="component-macro-rings">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Drawing nested arches */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Subtle Glow Filters */}
          <defs>
            <filter id="p-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.4" />
            </filter>
            <filter id="c-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.4" />
            </filter>
            <filter id="f-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ef4444" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Protein Ring (Blue - Outer) */}
          <circle
            cx={center}
            cy={center}
            r={rProtein}
            fill="transparent"
            stroke="#1e3a8a"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          <circle
            cx={center}
            cy={center}
            r={rProtein}
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            strokeDasharray={cProtein}
            strokeDashoffset={offsetProtein}
            strokeLinecap="round"
            filter="url(#p-glow)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }}
          />

          {/* 2. Carbs Ring (Amber - Middle) */}
          <circle
            cx={center}
            cy={center}
            r={rCarbs}
            fill="transparent"
            stroke="#78350f"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          <circle
            cx={center}
            cy={center}
            r={rCarbs}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={cCarbs}
            strokeDashoffset={offsetCarbs}
            strokeLinecap="round"
            filter="url(#c-glow)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }}
          />

          {/* 3. Fat Ring (Red - Inner) */}
          <circle
            cx={center}
            cy={center}
            r={rFat}
            fill="transparent"
            stroke="#7f1d1d"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          <circle
            cx={center}
            cy={center}
            r={rFat}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={cFat}
            strokeDashoffset={offsetFat}
            strokeLinecap="round"
            filter="url(#f-glow)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
          />
        </svg>

        {/* Center Text Layer showing visual summary percentage directly within the ring center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="text-3xl font-black text-rose-500 tracking-tighter font-mono animate-scaleUp">
            {Math.round(calPercent)}%
          </span>
          <span className="text-[8px] font-black tracking-widest text-neutral-400 uppercase mt-0.5">
            BUDGET MET
          </span>

          <div className="h-[1px] w-12 bg-neutral-850 my-1.5" />

          <span className="text-lg font-black text-white tracking-tight leading-none font-mono">
            {calRemaining.toLocaleString()}
          </span>
          <span className="text-neutral-500 text-[8px] font-black uppercase tracking-wider mt-0.5">
            kcal left
          </span>
        </div>
      </div>

      {/* Under-ring compact legend */}
      <div className="grid grid-cols-3 gap-6 mt-6 w-full max-w-sm px-2">
        <div className="flex flex-col items-center bg-neutral-900/45 p-2 rounded-xl border border-neutral-900/60 transition hover:bg-neutral-900">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Protein</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight">
            {protein.current}g <span className="text-[10px] text-neutral-500">/ {protein.target}g</span>
          </p>
          <div className="w-10 bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pctProtein}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-center bg-neutral-900/45 p-2 rounded-xl border border-neutral-900/60 transition hover:bg-neutral-900">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Carbs</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight">
            {carbs.current}g <span className="text-[10px] text-neutral-500">/ {carbs.target}g</span>
          </p>
          <div className="w-10 bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pctCarbs}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-center bg-neutral-900/45 p-2 rounded-xl border border-neutral-900/60 transition hover:bg-neutral-900">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Fat</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight">
            {fat.current}g <span className="text-[10px] text-neutral-500">/ {fat.target}g</span>
          </p>
          <div className="w-10 bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: `${pctFat}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
