import React, { useState } from 'react';
import { GoalType, ActivityLevel, UserProfile } from '../types';
import { calculateMifflinTargets } from '../data/mockData';
import { Flame, Scale, Dumbbell, Sparkles, Footprints, Keyboard, Trophy, Smile } from 'lucide-react';

interface OnboardingProps {
  onCompleteOnboarding: (profile: UserProfile) => void;
}

export function Onboarding({ onCompleteOnboarding }: OnboardingProps) {
  const [step, setStep] = useState<number>(0);
  
  // Intake state keys
  const [name, setName] = useState<string>('Alex');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(178);
  const [goal, setGoal] = useState<GoalType>('lose');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Calculate final target metrics on step 4
      const t = calculateMifflinTargets(gender, weight, height, age, activity, goal);
      
      const finishedProfile: UserProfile = {
        name: name || 'User',
        age,
        gender,
        weightKg: weight,
        heightCm: height,
        activityLevel: activity,
        goal,
        dailyCalorieTarget: t.calories,
        dailyProteinTarget: t.protein,
        dailyCarbsTarget: t.carbs,
        dailyFatTarget: t.fat,
        isOnboardingCompleted: true,
        streakCurrent: 1,
        streakLongest: 1,
        streakLastDate: new Date().toISOString().split('T')[0],
        isPremium: false
      };

      onCompleteOnboarding(finishedProfile);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white" id="component-onboarding">
      <div className="w-full max-w-lg bg-[#141414] rounded-3xl border border-neutral-800 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glowing Ambient Background Elements */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Progress Step Bar */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-rose-500 tracking-wider">CALTRACK</span>
            <span className="text-xs bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20">AI</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-rose-500' : 'w-2 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Cards with Micro-animations */}
        <div className="space-y-6 relative z-10 min-h-[340px]">
          {/* STEP 1: WELCOME & METRICS */}
          {step === 0 && (
            <div className="space-y-6 transform animate-fadeIn">
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-2">
                  <Smile className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Let's build your profile</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  CalTrack AI uses personalized intake questions based on the Mifflin-St Jeor calculation model to map your optimal daily calories & macros.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all placeholder:text-neutral-600"
                    placeholder="Enter nickname"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Age (Yrs)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 26)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Gender</label>
                    <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          gender === 'male' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          gender === 'female' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value) || 70)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 175)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT IS YOUR BODY GOAL */}
          {step === 1 && (
            <div className="space-y-6 transform animate-fadeIn">
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-2">
                  <Flame className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">What is your goal?</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We'll adapt your caloric deficit or surplus based on your fitness goals.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Goal Option Lose */}
                <button
                  type="button"
                  onClick={() => setGoal('lose')}
                  className={`flex items-center gap-4 text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    goal === 'lose'
                      ? 'bg-rose-500/10 border-rose-500 text-white shadow-lg'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${goal === 'lose' ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white">Lose Weight</h3>
                    <p className="text-neutral-500 text-xs mt-0.5">Maintain healthy caloric deficit to promote steady fat reduction.</p>
                  </div>
                </button>

                {/* Goal Option Maintain */}
                <button
                  type="button"
                  onClick={() => setGoal('maintain')}
                  className={`flex items-center gap-4 text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    goal === 'maintain'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${goal === 'maintain' ? 'bg-amber-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white">Maintain Weight</h3>
                    <p className="text-neutral-500 text-xs mt-0.5">Equilibrium energy intake to sustain body health and current look.</p>
                  </div>
                </button>

                {/* Goal Option Build */}
                <button
                  type="button"
                  onClick={() => setGoal('build')}
                  className={`flex items-center gap-4 text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    goal === 'build'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${goal === 'build' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white">Build Muscle</h3>
                    <p className="text-neutral-500 text-xs mt-0.5">Caloric surplus to support strength training and maximize repairs.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHYSICAL ACTIVITY */}
          {step === 2 && (
            <div className="space-y-6 transform animate-fadeIn">
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-2">
                  <Footprints className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Your activity level?</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  This affects your Total Daily Energy Expenditure (TDEE).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sedentary', title: 'Sedentary', desc: 'Little to no exercise, desk job', factor: 'x1.2' },
                  { id: 'light', title: 'Lightly Active', desc: '1-3 days casual workout', factor: 'x1.375' },
                  { id: 'moderate', title: 'Moderately Active', desc: '3-5 days gym workout', factor: 'x1.55' },
                  { id: 'very_active', title: 'Very Active', desc: 'Heavy sports or physically active job', factor: 'x1.725' }
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setActivity(act.id as ActivityLevel)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                      activity === act.id
                        ? 'bg-rose-500/10 border-rose-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{act.title}</h4>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-normal">{act.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5 self-start mt-3">
                      {act.factor}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RESULT CALCULATOR READY */}
          {step === 3 && (
            <div className="space-y-6 transform animate-fadeIn">
              <div className="space-y-2 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-3 pulsing-glow">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Your custom plan is set!</h2>
                <p className="text-neutral-400 text-xs max-w-sm mt-1 leading-relaxed">
                  Based on calculations, here are your optimized daily goal metrics for your <b>{goal === 'lose' ? 'Calorie Deficit' : goal === 'build' ? 'Muscle Gain' : 'Calorie Maintenance'}</b> plan.
                </p>
              </div>

              {/* Targets Summary Panel */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Daily Target Calories</span>
                  <span className="text-2xl font-black text-white">
                    {calculateMifflinTargets(gender, weight, height, age, activity, goal).calories} <span className="text-xs text-neutral-500 font-bold">kcal</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-neutral-900 p-3 rounded-xl text-center border border-neutral-800/80">
                    <span className="text-[10px] font-bold uppercase text-blue-400">Protein</span>
                    <p className="text-lg font-extrabold text-white mt-1">
                      {calculateMifflinTargets(gender, weight, height, age, activity, goal).protein}g
                    </p>
                    <span className="text-[9px] text-neutral-500 block mt-0.5">30% split</span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl text-center border border-neutral-800/80">
                    <span className="text-[10px] font-bold uppercase text-amber-400">Carbs</span>
                    <p className="text-lg font-extrabold text-white mt-1">
                      {calculateMifflinTargets(gender, weight, height, age, activity, goal).carbs}g
                    </p>
                    <span className="text-[9px] text-neutral-500 block mt-0.5">40% split</span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl text-center border border-neutral-800/80">
                    <span className="text-[10px] font-bold uppercase text-red-400">Fat</span>
                    <p className="text-lg font-extrabold text-white mt-1">
                      {calculateMifflinTargets(gender, weight, height, age, activity, goal).fat}g
                    </p>
                    <span className="text-[9px] text-neutral-500 block mt-0.5">30% split</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/10 text-xs text-rose-400 leading-normal">
                <Trophy className="w-5 h-5 shrink-0" />
                <span>By continuing, we will bootstrap your tracker diaries with 6 pre-populated logs of previous days to let you visualize charts instantly!</span>
              </div>
            </div>
          )}
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between mt-8 relative z-10 border-t border-neutral-800/60 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold border border-neutral-800 text-neutral-400 hover:text-white transition-all ${
              step === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20"
          >
            {step === totalSteps - 1 ? 'Start Tracking' : 'Continue'}
          </button>
        </div>

      </div>
    </div>
  );
}
