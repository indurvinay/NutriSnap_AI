import React from 'react';
import { UserProfile } from '../types';
import { Check, ShieldCheck, Sparkles, Zap, Award, Star, Lock } from 'lucide-react';

interface SubscriptionProps {
  profile: UserProfile;
  onUpgradeProfile: (upgradeState: boolean) => void;
  showToast: (msg: string) => void;
}

export function Subscription({ profile, onUpgradeProfile, showToast }: SubscriptionProps) {
  
  const handleToggleUpgrade = () => {
    const nextState = !profile.isPremium;
    onUpgradeProfile(nextState);
    if (nextState) {
      showToast("Premium unlocked! Unlimited scanning enabled. Sparkles loaded!");
    } else {
      showToast("Returned to free tier. Daily scanning limits restored.");
    }
  };

  const premiumFeatures = [
    { title: "Unlimited AI Food Scanning", desc: "Scan custom meals via the visual analyzer 100+ times daily with high precision." },
    { title: "Advanced PDF & Spreadsheet Export", desc: "Download chronological food catalogs and macro history logs at any period." },
    { title: "Custom Metric Calculations", desc: "Fully adjustment of daily target splits for specific ketogenic or high protein meals." },
    { title: "Smart Barcode & Nutrition Label Scanning", desc: "Point camera to pre-packaged boxes to instantly parse structural fats and sugars details." },
    { title: "Priority Dietitian Support Chat", desc: "Get real 1-on-1 nutritionist replies to optimize physical fitness and mass cuts." },
    { title: "Full Offline Local Backup", desc: "All histories are indexed locally and synchronized securely once network is back." }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none" id="component-subscription">
      
      {/* TITLE SECTION */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-500 hover:rotate-12 transition-all" />
          Premium Entitlements
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Unlock CalTrack AI's complete nutritional toolbox and live dietitian advisors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* PREMIUM UPGRADE DECK BOX CARD */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#1c1212] via-[#141414] to-neutral-950 rounded-2xl border border-rose-500/20 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
          
          {/* Visual Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase">
                  CALTRACK PREMIUM
                </span>
                <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
                  Macro Mastery Pro
                  <Award className="w-6 h-6 text-rose-500 shadow-inner" />
                </h2>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-black text-rose-400 font-mono">$9.99</span>
                <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Per Month</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Supercharge your fat-loss or muscle-building journey with unlimited smart AI vision plate scans, precise macronutrient calculators, and dietitian tips.
            </p>

            <div className="space-y-3.5">
              {premiumFeatures.map((feat, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                    <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-rose-500/10 mt-8 space-y-4">
            <button
              onClick={handleToggleUpgrade}
              className={`w-full py-4 text-center rounded-2xl text-xs font-black select-none uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.01] ${
                profile.isPremium
                  ? 'bg-neutral-900 border border-rose-500/40 hover:bg-neutral-800 text-rose-400 shadow-rose-500/5'
                  : 'bg-rose-500 hover:bg-rose-600 text-white font-extrabold shadow-rose-500/10 hover:shadow-rose-500/20'
              }`}
            >
              {profile.isPremium ? 'Downgrade Premium Access' : 'Purchase Subscription Now'}
            </button>
            <p className="text-[10px] text-center text-neutral-500 font-medium">
              30-day money-back guarantee. Cancel anytime with a single click. Secured by mockup purchases.
            </p>
          </div>

        </div>

        {/* COMPARATIVE METRICS BAR */}
        <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" /> Plan Compare
            </h3>
            
            <div className="space-y-3.5 pt-1">
              {/* Row 1 */}
              <div className="pb-3 border-b border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Daily AI Scans</span>
                <div className="flex gap-4 font-bold text-center font-mono">
                  <span className="text-neutral-500">3 Limit</span>
                  <span className="text-rose-400">Unlimited</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="pb-3 border-b border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Search ingredients</span>
                <div className="flex gap-5 font-bold text-center">
                  <span className="text-green-500">Free</span>
                  <span className="text-green-500">Free</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="pb-3 border-b border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Barcodes Scanner</span>
                <div className="flex gap-4 font-bold text-center">
                  <span className="text-zinc-600">Locked</span>
                  <span className="text-green-500">Unlocked</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="pb-3 border-b border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Streak recoveries</span>
                <div className="flex gap-4 font-bold text-center">
                  <span className="text-zinc-600">Locked</span>
                  <span className="text-green-400">3 / month</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="pb-3 border-b border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Dietitian Advice tips</span>
                <div className="flex gap-4 font-bold text-center">
                  <span className="text-zinc-600">Limited</span>
                  <span className="text-rose-400">Expanded</span>
                </div>
              </div>
            </div>
            
            {/* Locked Barcode Scanner Demo Showcase */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-950 text-center space-y-2 mt-4 relative overflow-hidden">
              <div className="absolute top-1.5 right-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500/60" />
              </div>
              <h4 className="text-xs font-bold text-neutral-300">Barcode & Label Scanner Simulator</h4>
              <p className="text-[10px] text-neutral-500 leading-normal">
                Premium users scan QR codes and barcodes to import exact nutrition facts. Upgrade to unlock this tool.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 text-center text-[10px] text-neutral-500 font-mono">
            Licence level: {profile.isPremium ? "PRO UNLIMITED" : "STANDARD FREE TIER"}
          </div>
        </div>

      </div>

    </div>
  );
}
