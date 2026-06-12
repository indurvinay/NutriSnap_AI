import React, { useState } from 'react';
import { DailyLog, UserProfile } from '../types';
import { BarChart3, TrendingUp, Calendar, Download, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

interface HistoryStatsProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
  onUpgradePrompt: () => void;
}

export function HistoryStats({ logs, profile, onUpgradePrompt }: HistoryStatsProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6);

  // Generate date strings for last 7 days (including today)
  const getPastDateStr = (daysAgo: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const dayAbbreviations = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Map 7 days of logs
  const stats7Days = Array.from({ length: 7 }).map((_, idx) => {
    const dateStr = getPastDateStr(6 - idx); // index 0 is 6 days ago, index 6 is today
    const log = logs[dateStr];

    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday...
    // Map to custom abbreviations
    const abb = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];

    let tCal = 0;
    let tProt = 0;
    let tCarb = 0;
    let tFat = 0;

    if (log && log.meals) {
      Object.values(log.meals).forEach(meal => {
        tCal += meal.totalCalories || 0;
        tProt += meal.totalProtein || 0;
        tCarb += meal.totalCarbs || 0;
        tFat += meal.totalFat || 0;
      });
    }

    return {
      date: dateStr,
      dayLabel: abb,
      calories: tCal,
      protein: Math.round(tProt),
      carbs: Math.round(tCarb),
      fat: Math.round(tFat),
      water: log?.waterIntakeMl || 0,
      weight: log?.weightKg || undefined
    };
  });

  // KPI aggregates
  const trackedDaysCount = stats7Days.filter(d => d.calories > 0).length || 1;
  const avgCal = Math.round(stats7Days.reduce((acc, d) => acc + d.calories, 0) / trackedDaysCount);
  const avgProt = Math.round(stats7Days.reduce((acc, d) => acc + d.protein, 0) / trackedDaysCount);
  const avgCarb = Math.round(stats7Days.reduce((acc, d) => acc + d.carbs, 0) / trackedDaysCount);
  const avgFat = Math.round(stats7Days.reduce((acc, d) => acc + d.fat, 0) / trackedDaysCount);

  // Find "Best Day" - defined as the day closest to calorie target
  const target = profile.dailyCalorieTarget;
  let bestDayLabel = 'N/A';
  let bestDelta = Infinity;
  stats7Days.forEach(day => {
    if (day.calories > 0) {
      const delta = Math.abs(day.calories - target);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestDayLabel = day.dayLabel;
      }
    }
  });

  const activeDay = selectedDayIndex !== null ? stats7Days[selectedDayIndex] : null;

  // SVG dimensions for Stacked Bar Chart
  const svgWidth = 460;
  const svgHeight = 200;
  const paddingX = 35;
  const paddingY = 20;
  const maxCal = Math.max(2600, ...stats7Days.map(d => d.calories));

  // Render Stacked Bars inside SVG
  const barsCount = 7;
  const spacing = (svgWidth - paddingX * 2) / (barsCount - 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none" id="component-historystats">
      {/* TITLE SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-500" />
            Weekly Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Monitor historical caloric streaks, average macros, and calorie deficits.</p>
        </div>

        {/* Premium Export Button */}
        <button
          onClick={() => {
            if (profile.isPremium) {
              alert("PDF Report generated successfully! Storing on cloud...");
            } else {
              onUpgradePrompt();
            }
          }}
          className="px-4.5 py-2.5 bg-[#141414] hover:bg-neutral-900 text-xs font-bold text-neutral-300 hover:text-white rounded-xl border border-neutral-800 hover:border-neutral-700 flex items-center gap-2 transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-rose-500" /> Export PDF Summary
          {!profile.isPremium && <span className="text-[9px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-black">PREMIUM</span>}
        </button>
      </div>

      {/* THREE EXCELLENT KEY PERFORMANCE METRIC TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Weekly Calorie Average</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{avgCal} kcal / day</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Best Calorie Match</span>
            <p className="text-xl font-extrabold text-white mt-0.5">
              {bestDayLabel} <span className="text-xs text-neutral-400 font-normal">({Math.abs(bestDelta) < 10000000 && bestDelta !== Infinity ? `±${bestDelta} kcal` : 'No logs'})</span>
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Active Calendar Streak</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{profile.streakCurrent} Days 🔥</p>
          </div>
        </div>
      </div>

      {/* CORE BAR CHART DRAWING AND METRICS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART CONTAINER PANEL */}
        <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Caloric History Over Time</h3>
            <span className="text-[10px] text-neutral-500 font-bold font-mono">Target: {profile.dailyCalorieTarget} kcal</span>
          </div>

          {/* SVG RENDERING BAR CHART */}
          <div className="relative pt-4 overflow-x-auto select-none">
            <div className="min-w-[460px]">
              <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="font-mono text-[9px] fill-neutral-500">
                
                {/* Horizontal Guide Lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingY + (svgHeight - paddingY * 2) * (1 - ratio);
                  const kcalLabel = Math.round(maxCal * ratio);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#222222"
                        strokeDasharray="4 4"
                      />
                      <text x={0} y={y + 3} className="text-[9px] fill-neutral-600 font-bold">
                        {kcalLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Ground floor line */}
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY}
                  stroke="#333333"
                />

                {/* Drawn Stacked Columns */}
                {stats7Days.map((day, idx) => {
                  const x = paddingX + idx * spacing;
                  const maxBarHeight = svgHeight - paddingY * 2;
                  
                  // Compute heights proportionate to max energy calories
                  const hTotal = (day.calories / maxCal) * maxBarHeight;
                  const totalHeight = Math.max(0, hTotal);
                  
                  // Compute proportional sub-segments for Fat, Protein, Carbs so it makes a stunning stacked layer bar!
                  const totalMacros = (day.protein + day.carbs + day.fat) || 1;
                  const ratioProt = day.protein / totalMacros;
                  const ratioCarb = day.carbs / totalMacros;
                  const ratioFat = day.fat / totalMacros;
                  
                  const hProt = totalHeight * ratioProt;
                  const hCarb = totalHeight * ratioCarb;
                  const hFat = totalHeight * ratioFat;

                  // Vertical offset coordinates
                  const yFloor = svgHeight - paddingY;
                  const yProtStart = yFloor - hProt;
                  const yCarbStart = yProtStart - hCarb;
                  const yFatStart = yCarbStart - hFat;

                  const columnWidth = 24;
                  const isSelected = selectedDayIndex === idx;

                  return (
                    <g
                      key={day.date}
                      className="cursor-pointer group"
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {/* Transparent Hover Area to make clicking extremely easy */}
                      <rect
                        x={x - 4}
                        y={paddingY}
                        width={columnWidth + 8}
                        height={maxBarHeight}
                        fill="transparent"
                      />

                      {/* Stacked segment 1: Protein (Blue) */}
                      {day.calories > 0 && hProt > 0 && (
                        <rect
                          x={x}
                          y={yProtStart}
                          width={columnWidth}
                          height={hProt}
                          fill="#3b82f6"
                          className="opacity-75 group-hover:opacity-100 transition-opacity"
                        />
                      )}

                      {/* Stacked segment 2: Carbs (Amber) */}
                      {day.calories > 0 && hCarb > 0 && (
                        <rect
                          x={x}
                          y={yCarbStart}
                          width={columnWidth}
                          height={hCarb}
                          fill="#f59e0b"
                          className="opacity-75 group-hover:opacity-100 transition-opacity"
                        />
                      )}

                      {/* Stacked segment 3: Fat (Red) */}
                      {day.calories > 0 && hFat > 0 && (
                        <rect
                          x={x}
                          y={yFatStart}
                          width={columnWidth}
                          height={hFat}
                          fill="#ef4444"
                          className="opacity-75 group-hover:opacity-100 transition-opacity"
                          rx={1.5}
                        />
                      )}

                      {/* Selected Outline Highlighter */}
                      {isSelected && (
                        <rect
                          x={x - 3}
                          y={Math.min(yFatStart, yFloor - totalHeight) - 3}
                          width={columnWidth + 6}
                          height={(day.calories > 0 ? totalHeight : 3) + 6}
                          fill="transparent"
                          stroke="#ff6b6b"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                          className="rounded"
                        />
                      )}

                      {/* Bottom axis day letters */}
                      <text
                        x={x + columnWidth / 2}
                        y={svgHeight - 4}
                        textAnchor="middle"
                        className={`text-[9px] font-bold ${
                          isSelected ? 'fill-rose-400 font-extrabold' : 'fill-neutral-500'
                        }`}
                      >
                        {day.dayLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Target Calorie Guide Line */}
                <line
                  x1={paddingX}
                  y1={paddingY + (svgHeight - paddingY * 2) * (1 - (profile.dailyCalorieTarget / maxCal))}
                  x2={svgWidth - paddingX}
                  y2={paddingY + (svgHeight - paddingY * 2) * (1 - (profile.dailyCalorieTarget / maxCal))}
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  strokeDasharray="2 2"
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 text-[10px] font-bold pt-2 border-t border-neutral-900">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#3b82f6]" />
              <span className="text-neutral-400">Protein</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#f59e0b]" />
              <span className="text-neutral-400">Carbs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#ef4444]" />
              <span className="text-neutral-400">Fat</span>
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <span className="border-b border-rose-500 border-dashed w-5 inline-block" />
              <span className="text-neutral-500">Daily Target Cap</span>
            </div>
          </div>
        </div>

        {/* SIDE BAR: HIGHLIGHED SPECIFIC SELECTION METRICS */}
        <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Day Breakdown</h3>
            
            {activeDay && activeDay.calories > 0 ? (
              <div className="space-y-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 uppercase font-black">Calories Eaten</span>
                  <p className="text-2xl font-black text-rose-500 mt-1">{activeDay.calories.toLocaleString()} <span className="text-xs text-neutral-400 font-bold">kcal</span></p>
                  
                  {/* Performance comparison progress bar */}
                  <div className="w-full bg-neutral-900 border border-neutral-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activeDay.calories > target ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (activeDay.calories / target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-400 block mt-1.5">
                    {activeDay.calories > target 
                      ? `${activeDay.calories - target} kcal surplus of goal` 
                      : `${target - activeDay.calories} kcal deficit of goal`}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Protein
                    </span>
                    <span className="text-white font-mono font-bold">{activeDay.protein}g / {profile.dailyProteinTarget}g</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Carbohydrates
                    </span>
                    <span className="text-white font-mono font-bold">{activeDay.carbs}g / {profile.dailyCarbsTarget}g</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Fat
                    </span>
                    <span className="text-white font-mono font-bold">{activeDay.fat}g / {profile.dailyFatTarget}g</span>
                  </div>
                </div>

                {activeDay.water > 0 && (
                  <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 flex justify-between items-center text-xs text-blue-400">
                    <span className="font-bold">💧 Water Hydration logged</span>
                    <span className="font-mono font-bold">{activeDay.water} ml</span>
                  </div>
                )}

                {logs[activeDay.date]?.reflection && (
                  <div className="bg-rose-500/[0.02] p-3 rounded-xl border border-rose-500/10 space-y-1">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Daily Reflection Journal</span>
                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      "{logs[activeDay.date].reflection}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-500 flex flex-col items-center justify-center space-y-2">
                <Calendar className="w-10 h-10 opacity-30" />
                <p className="text-xs font-bold leading-normal">
                  No meal entries recorded on {activeDay ? activeDay.dayLabel : 'selected date'}.
                </p>
                <p className="text-[10px] text-neutral-600 max-w-xs leading-normal">Go to the diary slot to log food items or use active scanner.</p>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-900 mt-6 pt-4 text-center">
            <p className="text-[10px] text-neutral-500 font-mono">Select columns to isolate date aggregates.</p>
          </div>
        </div>

      </div>

      {/* COMPRESSED MACRO AVERAGES PROGRESS BARS */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" /> Average Daily Macros This Week
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Protein Avg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-bold">Protein Average</span>
              <span className="text-white font-bold">{avgProt}g <span className="text-[10px] text-neutral-500">/ {profile.dailyProteinTarget}g</span></span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800/80 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (avgProt / profile.dailyProteinTarget) * 100)}%` }} />
            </div>
          </div>

          {/* Carbs Avg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-bold">Carbs Average</span>
              <span className="text-white font-bold">{avgCarb}g <span className="text-[10px] text-neutral-500">/ {profile.dailyCarbsTarget}g</span></span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800/80 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (avgCarb / profile.dailyCarbsTarget) * 100)}%` }} />
            </div>
          </div>

          {/* Fat Avg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-bold">Fat Average</span>
              <span className="text-white font-bold">{avgFat}g <span className="text-[10px] text-neutral-500">/ {profile.dailyFatTarget}g</span></span>
            </div>
            <div className="w-full bg-neutral-900 border border-neutral-800/80 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (avgFat / profile.dailyFatTarget) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
