import React, { useState } from 'react';
import { UserProfile, GoalType, ActivityLevel } from '../types';
import { calculateMifflinTargets } from '../data/mockData';
import { 
  User, 
  Settings, 
  Flame, 
  Scale, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  LogOut, 
  RotateCcw, 
  RotateCw, 
  Grid, 
  Sliders, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Bell,
  Coffee,
  Utensils,
  Moon
} from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  onResetOnboarding: () => void;
  onPurgeLogs: () => void;
  onSeedLogs: () => void;
  onIncrementStreak: () => void;
  showToast: (msg: string) => void;
}

export function ProfileSettings({
  profile,
  onSaveProfile,
  onLogout,
  onResetOnboarding,
  onPurgeLogs,
  onSeedLogs,
  onIncrementStreak,
  showToast
}: ProfileSettingsProps) {
  // Local state copy of profile variables to handle in-place edit before saving
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age || 26);
  const [gender, setGender] = useState<'male' | 'female' | 'prefer-not-to-say'>(profile.gender || 'male');
  const [weightKg, setWeightKg] = useState(profile.weightKg || 75);
  const [heightCm, setHeightCm] = useState(profile.heightCm || 178);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'moderate');
  const [goal, setGoal] = useState<GoalType>(profile.goal || 'lose');

  // Trigger calculations directly
  const targets = calculateMifflinTargets(gender, weightKg, heightCm, age, activityLevel, goal);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProfile: UserProfile = {
      ...profile,
      name: name || 'User',
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
      goal,
      dailyCalorieTarget: targets.calories,
      dailyProteinTarget: targets.protein,
      dailyCarbsTarget: targets.carbs,
      dailyFatTarget: targets.fat
    };

    onSaveProfile(updatedProfile);
    showToast("Profile physical metrics updated! Dynamic macro targets rebuilt.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 font-medium" id="component-profile-settings">
      
      {/* 1. VISUAL AVATAR PANEL */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Monogram circle */}
        <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 text-3xl font-black shrink-0 relative shadow-inner">
          {name.charAt(0).toUpperCase() || 'U'}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-neutral-950 border border-neutral-800 text-rose-400 flex items-center justify-center text-[10px]" title="Active Streak">
            🔥
          </span>
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-black text-white truncate">{name || 'CalTrack Active User'}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase inline-block self-center sm:self-auto border ${
              profile.isPremium 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                : 'bg-neutral-900 text-neutral-500 border-neutral-800/80'
            }`}>
              {profile.isPremium ? 'Macro Pro Member ✦' : 'Free Tier'}
            </span>
          </div>
          
          <div className="text-xs text-neutral-400 space-y-1">
            <p className="flex items-center justify-center sm:justify-start gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-neutral-600" /> Member since: June 2026 Sandbox
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-neutral-500">
              Active Streak: <span className="text-rose-400 font-bold">{profile.streakCurrent} days</span> · Longest Streak: <span className="text-white font-bold">{profile.streakLongest} days</span>
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2.5 bg-neutral-950 hover:bg-rose-950/20 text-neutral-400 hover:text-rose-400 border border-neutral-850 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-stretch sm:self-center justify-center cursor-pointer select-none"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      {/* 2. MAIN PHYSICAL METRICS FORM (PROFILE EDIT) */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Sliders className="w-5 h-5 text-rose-500" />
          <div>
            <h3 className="text-sm font-black text-white">Physical Intake Metrics</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Edit parameters below to automatically feed Mifflin-St Jeor calories equations.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nickname */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Nickname / Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Age (Years)</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 26)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Gender Biological</label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition cursor-pointer"
              >
                <option value="male">Male (BMR Offset +5)</option>
                <option value="female">Female (BMR Offset -161)</option>
                <option value="prefer-not-to-say">Prefer Not To Say</option>
              </select>
            </div>

            {/* Activity multiplication */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Physical Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e: any) => setActivityLevel(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition cursor-pointer"
              >
                <option value="sedentary">Sedentary (No workouts · x1.2)</option>
                <option value="light">Lightly Active (1-3 days casual · x1.375)</option>
                <option value="moderate">Moderately Active (3-5 days gyms · x1.55)</option>
                <option value="very_active">Very Active (Heavy sports · x1.725)</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Body Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 75)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-rose-500 transition"
                />
                <span className="absolute right-4 top-3.5 text-[10px] text-neutral-500 font-bold uppercase">KG</span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Stature Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 178)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-rose-500 transition"
                />
                <span className="absolute right-4 top-3.5 text-[10px] text-neutral-500 font-bold uppercase">CM</span>
              </div>
            </div>

          </div>

          {/* Goal Selector Grid */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Physique Target Goal</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('lose')}
                className={`py-3 px-4 rounded-xl text-xs font-bold text-left border transition-all ${
                  goal === 'lose' ? 'bg-rose-500/15 border-rose-500 text-white' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-750 text-neutral-400'
                }`}
              >
                🔥 Lose Weight <span className="block text-[9px] text-neutral-500 font-normal mt-0.5">-500 kcal deficit</span>
              </button>

              <button
                type="button"
                onClick={() => setGoal('maintain')}
                className={`py-3 px-4 rounded-xl text-xs font-bold text-left border transition-all ${
                  goal === 'maintain' ? 'bg-amber-500/15 border-amber-500 text-white' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-750 text-neutral-400'
                }`}
              >
                ⚖️ Maintain Weight <span className="block text-[9px] text-neutral-500 font-normal mt-0.5">TDEE equilibrium</span>
              </button>

              <button
                type="button"
                onClick={() => setGoal('build')}
                className={`py-3 px-4 rounded-xl text-xs font-bold text-left border transition-all ${
                  goal === 'build' ? 'bg-emerald-500/15 border-emerald-500 text-white' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-750 text-neutral-400'
                }`}
              >
                💪 Build Muscle <span className="block text-[9px] text-neutral-500 font-normal mt-0.5">+300 kcal surplus</span>
              </button>
            </div>
          </div>

          {/* Dynamic computed preview bar */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-2">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Dynamic Targets Computed Offline:</span>
            <div className="flex justify-between items-center bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/50">
              <span className="text-xs text-neutral-400">Daily Calorie Target:</span>
              <span className="text-sm font-black text-rose-400 font-mono">{targets.calories} kcal/day</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-neutral-900/60 p-2 rounded-lg text-xs">
                <span className="text-blue-400 font-bold block text-[10px] uppercase">Protein</span>
                <span className="text-white font-mono font-bold mt-1 block">{targets.protein}g</span>
              </div>
              <div className="text-center bg-neutral-900/60 p-2 rounded-lg text-xs">
                <span className="text-amber-400 font-bold block text-[10px] uppercase">Carbs</span>
                <span className="text-white font-mono font-bold mt-1 block">{targets.carbs}g</span>
              </div>
              <div className="text-center bg-neutral-900/60 p-2 rounded-lg text-xs">
                <span className="text-rose-400 font-bold block text-[10px] uppercase">Fat</span>
                <span className="text-white font-mono font-bold mt-1 block">{targets.fat}g</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Save Physical Changes
          </button>
        </form>
      </div>

      {/* DAILY REMINDERS & NOTIFICATIONS */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4" id="component-daily-intake-reminders">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Bell className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <h3 className="text-sm font-black text-white">Daily Intake Reminders</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Configure system prompt alerts or web push browser notifications to keep your logs updated.</p>
          </div>
        </div>

        <div className="space-y-3">
          
          {/* Breakfast Reminder */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Breakfast Reminder Alert</span>
                <span className="block text-[10px] text-neutral-500 font-mono">Scheduled for 08:00 AM daily</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const currentVal = !!profile.breakfastReminder;
                const newVal = !currentVal;
                
                // Request Permission
                if (newVal && "Notification" in window && Notification.permission === "default") {
                  Notification.requestPermission();
                }

                onSaveProfile({
                  ...profile,
                  breakfastReminder: newVal
                });
                showToast(`Breakfast alarm successfully ${newVal ? 'ENABLED 🔔' : 'DISABLED 🔕'}.`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                profile.breakfastReminder ? 'bg-rose-500' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  profile.breakfastReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lunch Reminder */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Lunch Reminder Alert</span>
                <span className="block text-[10px] text-neutral-500 font-mono">Scheduled for 01:00 PM daily</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const currentVal = !!profile.lunchReminder;
                const newVal = !currentVal;
                
                // Request Permission
                if (newVal && "Notification" in window && Notification.permission === "default") {
                  Notification.requestPermission();
                }

                onSaveProfile({
                  ...profile,
                  lunchReminder: newVal
                });
                showToast(`Lunch alarm successfully ${newVal ? 'ENABLED 🔔' : 'DISABLED 🔕'}.`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                profile.lunchReminder ? 'bg-rose-500' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  profile.lunchReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dinner Reminder */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Dinner Reminder Alert</span>
                <span className="block text-[10px] text-neutral-500 font-mono">Scheduled for 07:00 PM daily</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const currentVal = !!profile.dinnerReminder;
                const newVal = !currentVal;
                
                // Request Permission
                if (newVal && "Notification" in window && Notification.permission === "default") {
                  Notification.requestPermission();
                }

                onSaveProfile({
                  ...profile,
                  dinnerReminder: newVal
                });
                showToast(`Dinner alarm successfully ${newVal ? 'ENABLED 🔔' : 'DISABLED 🔕'}.`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                profile.dinnerReminder ? 'bg-rose-500' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  profile.dinnerReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Test Trigger Button */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900/60 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="text-center md:text-left">
            <h4 className="text-xs font-bold text-white">Interactive Reminder Simulator</h4>
            <p className="text-[10px] text-neutral-500 mt-1">Want to experiment right away? Test live system reminders if native push keys are iframe locked.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              // Try push notification if supported & approved
              let pushed = false;
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification("CalTrack Dynamic Alarm", {
                    body: `Hey ${profile.name}! Keep your hot ${profile.streakCurrent || 1}-day streak burning! Log your physical meals now. 🔥`,
                    icon: "/favicon.ico"
                  });
                  pushed = true;
                  showToast("Simulated browser alert notification dispatch sent!");
                } catch {
                  pushed = false;
                }
              }

              if (!pushed) {
                // Fallback elegant alert box reminding them
                alert(`🔔 CalTrack Active Reminder Alarm!\n\nHey there ${profile.name}! Remember to log your active meal now to keep your hot ${profile.streakCurrent || 1}-day streak active. Keep up the high effort physically! 🔥`);
                showToast("Simulated custom browser pop-up reminder!");
              }
            }}
            className="w-full md:w-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-300 rounded-lg text-xs font-bold border border-neutral-800 transition shadow-inner whitespace-nowrap cursor-pointer select-none"
          >
            ⚡ Test Notification Alarms
          </button>
        </div>
      </div>

      {/* 3. SIMULATOR TOOLBOX & RESET DIAGNOSTICS (SETTINGS VIEW) */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Settings className="w-5 h-5 text-neutral-400" />
          <div>
            <h3 className="text-sm font-black text-white">System Settings & Calibrations</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Control sandbox simulation data and developer streak bypasses directly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* STREAK SHORTCUT */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                🔥 Hot Streak Bypass
              </h4>
              <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                Simulates consecutive daily logs to test calendar calculations.
              </p>
            </div>
            <button
              type="button"
              onClick={onIncrementStreak}
              className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-rose-400 hover:text-white font-black uppercase border border-neutral-800 rounded-lg transition"
            >
              Add +1 Day Streak
            </button>
          </div>

          {/* ONBOARDING RE-TRIGGER */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                🔁 Re-trigger Intake
              </h4>
              <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                Rerun onboarding guide wizard to choose a calorie preset.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetOnboarding}
              className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-neutral-300 font-black uppercase border border-neutral-800 rounded-lg transition"
            >
              Start Intake Wizard
            </button>
          </div>

          {/* HISTORIC SEED SHIELD */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">
                📈 Populate Test Ledger
              </h4>
              <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                Hydrates 6 past days of calorie entries to verifystats.
              </p>
            </div>
            <button
              type="button"
              onClick={onSeedLogs}
              className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-neutral-300 hover:text-rose-400 font-bold border border-neutral-800 rounded-lg transition"
            >
              Inject History Seed
            </button>
          </div>

          {/* ERASE SHIELD */}
          <div className="p-4 bg-rose-500/[0.02] rounded-xl border border-rose-500/10 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Purge Cache Records
              </h4>
              <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                Wipes all logs, goals, and sandbox cache metrics completely.
              </p>
            </div>
            <button
              type="button"
              onClick={onPurgeLogs}
              className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-[10px] text-rose-400 font-extrabold border border-rose-500/20 rounded-lg transition"
            >
              Wipe Database
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
