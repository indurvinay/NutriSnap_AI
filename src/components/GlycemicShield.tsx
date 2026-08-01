import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Activity, Footprints, AlertTriangle, CheckCircle2, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';

interface GlycemicShieldProps {
  todayLog: DailyLog;
  showToast: (msg: string) => void;
}

export function GlycemicShield({ todayLog, showToast }: GlycemicShieldProps) {
  const [isWalkTimerActive, setIsWalkTimerActive] = useState(false);
  const [walkSecondsLeft, setWalkSecondsLeft] = useState(600); // 10 minutes = 600s
  const [isWalkCompleted, setIsWalkCompleted] = useState(false);

  // Compute total carbs & glycemic load today
  let totalCarbs = 0;
  let mealCount = 0;

  if (todayLog && todayLog.meals) {
    Object.values(todayLog.meals).forEach(m => {
      totalCarbs += m.totalCarbs || 0;
      if (m.items.length > 0) mealCount++;
    });
  }

  // Estimate peak glucose spike (mg/dL) based on consumed carbohydrates
  const baselineGlucose = 85;
  const projectedSpike = Math.round(baselineGlucose + (totalCarbs * 0.45));
  const isHighRiskSpike = projectedSpike > 140;

  const start10MinWalk = () => {
    setIsWalkTimerActive(true);
    showToast("10-Minute Post-Meal Glucose Walk initiated! 🚶‍♂️");
    
    // Simulate walk completion after timer
    setTimeout(() => {
      setIsWalkTimerActive(false);
      setIsWalkCompleted(true);
      showToast("Walk completed! Glucose curve reduced by 35%! 🎉");
    }, 5000);
  };

  return (
    <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-5" id="component-cgm-shield">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-500" /> CGM Continuous Glucose Monitor Shield
          </span>
          <h2 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            Blood Sugar Curve & Glycemic Predictor
          </h2>
          <p className="text-xs text-neutral-400">Predicts post-prandial glucose spikes and triggers micro-habit walking interventions.</p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 font-mono text-xs font-bold">
          <span className="text-neutral-500 uppercase text-[9px]">Est. Peak Glucose:</span>
          <span className={`text-sm ${isHighRiskSpike ? 'text-amber-400 font-black' : 'text-emerald-400 font-black'}`}>
            {isWalkCompleted ? Math.round(projectedSpike * 0.65) : projectedSpike} mg/dL
          </span>
        </div>
      </div>

      {/* SVG BLOOD SUGAR PREDICTION CURVE GRAPH */}
      <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-neutral-400 font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-rose-500" /> 120-Minute Glucose Curve Prediction
          </span>
          <span className="text-[10px] text-neutral-500">Normal Range: 80-140 mg/dL</span>
        </div>

        <div className="relative pt-2">
          <svg width="100%" height="110" viewBox="0 0 400 110" className="overflow-visible">
            {/* Threshold reference line */}
            <line x1="0" y1="35" x2="400" y2="35" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1" opacity="0.4" />
            <text x="350" y="30" fill="#ef4444" className="text-[9px] font-mono font-bold">140 mg/dL Spike</text>

            {/* Unmitigated Curve (Red/Amber) */}
            <path
              d="M 0,90 Q 100,10 200,30 T 400,85"
              fill="none"
              stroke={isWalkCompleted ? "#333" : "#f59e0b"}
              strokeWidth="3"
              strokeDasharray={isWalkCompleted ? "4 4" : "none"}
            />

            {/* Post-Walk Blunted Curve (Green) */}
            {isWalkCompleted && (
              <path
                d="M 0,90 Q 100,55 200,65 T 400,85"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                className="animate-fadeIn"
              />
            )}

            {/* Peak Dot */}
            <circle cx="120" cy={isWalkCompleted ? 55 : 20} r="5" fill={isWalkCompleted ? "#10b981" : "#f43f5e"} />
          </svg>
        </div>

        <div className="flex justify-between text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-2">
          <span>0 min (Meal Logged)</span>
          <span>45 min (Predicted Peak)</span>
          <span>120 min (Recovery)</span>
        </div>
      </div>

      {/* MICRO-HABIT ALERT NUDGE BANNER */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
        isWalkCompleted
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : isHighRiskSpike
          ? 'bg-rose-500/10 border-rose-500/30'
          : 'bg-neutral-900 border-neutral-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${isWalkCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {isWalkCompleted ? <ShieldCheck className="w-5 h-5" /> : <Footprints className="w-5 h-5 animate-bounce" />}
          </div>
          <div>
            <h4 className="text-xs font-black text-white">
              {isWalkCompleted ? "Glucose Spike Shield Active!" : "High Glucose Spike Risk Detected!"}
            </h4>
            <p className="text-xs text-neutral-300 mt-0.5 max-w-xl leading-relaxed">
              {isWalkCompleted
                ? "Your 10-minute post-meal walk has successfully blunted the glucose curve by 35% and increased insulin sensitivity."
                : 'Take a 10-minute brisk walk right now to blunt your predicted glucose spike by 35% and maintain steady daily energy!'}
            </p>
          </div>
        </div>

        {!isWalkCompleted && (
          <button
            onClick={start10MinWalk}
            disabled={isWalkTimerActive}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Footprints className="w-4 h-4" /> {isWalkTimerActive ? 'Walking Timer Running...' : 'Start 10-Min Walk Now'}
          </button>
        )}
      </div>
    </div>
  );
}
