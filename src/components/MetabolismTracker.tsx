import React, { useState } from 'react';
import { UserProfile, DailyLog, CycleDayType } from '../types';
import { Dumbbell, ShieldAlert, Sparkles, Zap, Heart, CheckCircle2, RefreshCw } from 'lucide-react';

interface MetabolismTrackerProps {
  profile: UserProfile;
  todayLog: DailyLog;
  onUpdateProfile: (updated: UserProfile) => void;
  showToast: (msg: string) => void;
}

export function MetabolismTracker({
  profile,
  todayLog,
  onUpdateProfile,
  showToast
}: MetabolismTrackerProps) {
  const [cycleType, setCycleType] = useState<CycleDayType>('training');

  // Compute micronutrient estimations from today's log
  let consumedFiberG = 0;
  let consumedZincMg = 0;
  let consumedMagnesiumMg = 0;
  let consumedVitaminD3IU = 0;

  if (todayLog && todayLog.meals) {
    Object.values(todayLog.meals).forEach(m => {
      m.items.forEach(item => {
        const lower = item.name.toLowerCase();
        consumedFiberG += Math.round((item.carbsG || 0) * 0.25);
        if (lower.includes('egg') || lower.includes('steak') || lower.includes('paneer') || lower.includes('tofu')) {
          consumedZincMg += 3.5;
          consumedMagnesiumMg += 65;
        }
        if (lower.includes('salmon') || lower.includes('egg') || lower.includes('milk')) {
          consumedVitaminD3IU += 450;
        }
      });
    });
  }

  // Carb Cycling Targets
  const baseCal = profile.dailyCalorieTarget || 2000;
  const baseProt = profile.dailyProteinTarget || 150;

  const trainingTargets = {
    cal: Math.round(baseCal * 1.12),
    prot: baseProt,
    carbs: Math.round((baseCal * 0.5) / 4),
    fat: Math.round((baseCal * 0.2) / 9)
  };

  const restTargets = {
    cal: Math.round(baseCal * 0.88),
    prot: baseProt,
    carbs: Math.round((baseCal * 0.22) / 4),
    fat: Math.round((baseCal * 0.4) / 9)
  };

  const activeTargets = cycleType === 'training' ? trainingTargets : restTargets;

  const handleApplyCyclingTargets = () => {
    onUpdateProfile({
      ...profile,
      dailyCalorieTarget: activeTargets.cal,
      dailyProteinTarget: activeTargets.prot,
      dailyCarbsTarget: activeTargets.carbs,
      dailyFatTarget: activeTargets.fat
    });
    showToast(`Applied ${cycleType.toUpperCase()} Day targets (${activeTargets.cal} kcal)! 🏋️‍♂️`);
  };

  return (
    <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-6 select-none" id="component-metabolism">
      {/* CARB CYCLING SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-blue-500" /> Hypertrophy & Metabolism Matrix
            </span>
            <h2 className="text-xl font-black text-white mt-1.5">Carb & Calorie Cycling Architecture</h2>
            <p className="text-xs text-neutral-400">Optimize glycogen replenishment on workout days & fat oxidation on rest days.</p>
          </div>

          {/* CYCLE TOGGLE BUTTONS */}
          <div className="flex bg-neutral-900 p-1 rounded-2xl border border-neutral-800 text-xs font-bold">
            <button
              onClick={() => setCycleType('training')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                cycleType === 'training'
                  ? 'bg-rose-500 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" /> Training Day
            </button>
            <button
              onClick={() => setCycleType('rest')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                cycleType === 'rest'
                  ? 'bg-blue-500 text-white font-black shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rest / Recovery
            </button>
          </div>
        </div>

        {/* ACTIVE CYCLE MACRO TARGETS DISPLAY */}
        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
          <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <span className="text-[9px] text-neutral-500 uppercase font-black block">Caloric Target</span>
            <span className="text-base font-black text-rose-500">{activeTargets.cal} kcal</span>
          </div>
          <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <span className="text-[9px] text-neutral-500 uppercase font-black block">Protein Target</span>
            <span className="text-base font-black text-blue-400">{activeTargets.prot}g</span>
          </div>
          <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <span className="text-[9px] text-neutral-500 uppercase font-black block">Carbs Target</span>
            <span className="text-base font-black text-amber-400">{activeTargets.carbs}g</span>
          </div>
          <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <span className="text-[9px] text-neutral-500 uppercase font-black block">Fats Target</span>
            <span className="text-base font-black text-red-400">{activeTargets.fat}g</span>
          </div>
        </div>

        <button
          onClick={handleApplyCyclingTargets}
          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white border border-neutral-800 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-rose-500" /> Apply {cycleType.toUpperCase()} Day Macro Targets to Today's Dashboard
        </button>
      </div>

      {/* HORMONAL & GUT MICROBIOME TRACKER */}
      <div className="space-y-4 border-t border-neutral-900 pt-5">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-400" /> Gut Microbiome & Hormonal Micronutrient Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fiber Gut Health */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400 font-bold">🌱 Dietary Fiber (Microbiome Target)</span>
              <span className="text-emerald-400 font-bold">{consumedFiberG}g / 30g min</span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (consumedFiberG / 30) * 100)}%` }} />
            </div>
          </div>

          {/* Zinc */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400 font-bold">⚡ Zinc (Testosterone & Recovery)</span>
              <span className="text-blue-400 font-bold">{consumedZincMg.toFixed(1)}mg / 15mg</span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (consumedZincMg / 15) * 100)}%` }} />
            </div>
          </div>

          {/* Magnesium */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400 font-bold">💤 Magnesium (Sleep & Muscle Repair)</span>
              <span className="text-purple-400 font-bold">{consumedMagnesiumMg}mg / 400mg</span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, (consumedMagnesiumMg / 400) * 100)}%` }} />
            </div>
          </div>

          {/* Vitamin D3 */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400 font-bold">☀️ Vitamin D3 (Immunity & Vitality)</span>
              <span className="text-amber-400 font-bold">{consumedVitaminD3IU}IU / 2000IU</span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (consumedVitaminD3IU / 2000) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
