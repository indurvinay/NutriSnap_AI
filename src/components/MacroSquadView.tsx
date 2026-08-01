import React, { useState } from 'react';
import { UserProfile, MacroSquad, MacroSquadMember } from '../types';
import { Users, Shield, Trophy, Sparkles, CheckCircle2, Flame, UserPlus, Heart, Award } from 'lucide-react';

interface MacroSquadViewProps {
  profile: UserProfile;
  showToast: (msg: string) => void;
}

export function MacroSquadView({ profile, showToast }: MacroSquadViewProps) {
  const [squad, setSquad] = useState<MacroSquad>({
    id: 'squad-alpha-1',
    name: 'Apex Calorie Crusaders',
    guildLevel: 4,
    guildXp: 2850,
    streakInsuranceTokens: 2,
    members: [
      { id: 'm1', name: profile.name || 'You', avatar: '🔥', streakDays: profile.streakCurrent || 7, hasLoggedToday: true },
      { id: 'm2', name: 'Sarah Miller', avatar: '🥗', streakDays: 14, hasLoggedToday: true },
      { id: 'm3', name: 'David Chen', avatar: '⚡', streakDays: 21, hasLoggedToday: true },
      { id: 'm4', name: 'Elena Rostova', avatar: '💪', streakDays: 9, hasLoggedToday: false },
      { id: 'm5', name: 'Marcus Vance', avatar: '🥑', streakDays: 18, hasLoggedToday: true }
    ]
  });

  const handleUseStreakInsurance = (memberId: string, memberName: string) => {
    if (squad.streakInsuranceTokens <= 0) {
      showToast("No Streak Insurance Tokens remaining! Earn more by logging 7 days straight.");
      return;
    }

    setSquad(prev => ({
      ...prev,
      streakInsuranceTokens: prev.streakInsuranceTokens - 1,
      members: prev.members.map(m => m.id === memberId ? { ...m, hasLoggedToday: true } : m)
    }));

    showToast(`Protected ${memberName}'s streak using 1 Streak Insurance Token! 🛡️`);
  };

  return (
    <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-6 select-none" id="component-macro-squad">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-500" /> Behavioral Psychology & Squad Leagues
            </span>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
              LEVEL {squad.guildLevel} GUILD
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            {squad.name}
          </h2>
          <p className="text-xs text-neutral-400">5-person accountability squad. Protect team streaks with Streak Insurance Tokens.</p>
        </div>

        {/* STREAK INSURANCE TOKENS BADGE */}
        <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 flex items-center gap-3 font-mono">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase font-black block">Streak Insurance Tokens</span>
            <span className="text-lg font-black text-blue-400">{squad.streakInsuranceTokens} Available</span>
          </div>
        </div>
      </div>

      {/* GUILD XP PROGRESS BAR */}
      <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-neutral-400 font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Guild Shared XP Progress
          </span>
          <span className="text-white font-bold">{squad.guildXp} / 4000 XP</span>
        </div>
        <div className="w-full bg-neutral-900 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700 shadow-[0_0_10px_#f43f5e]"
            style={{ width: `${(squad.guildXp / 4000) * 100}%` }}
          />
        </div>
      </div>

      {/* 5-PERSON SQUAD MEMBERS GRID */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider text-neutral-400">Squad Members (5/5)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {squad.members.map(member => (
            <div
              key={member.id}
              className="bg-neutral-900/70 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between transition hover:border-neutral-750"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xl">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    {member.name} {member.id === 'm1' && <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 rounded">YOU</span>}
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono font-bold block mt-0.5">
                    🔥 {member.streakDays}-Day Caloric Streak
                  </span>
                </div>
              </div>

              {/* STATUS OR INSURANCE TRIGGER */}
              <div>
                {member.hasLoggedToday ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Logged Today
                  </span>
                ) : (
                  <button
                    onClick={() => handleUseStreakInsurance(member.id, member.name)}
                    className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 transition cursor-pointer font-mono"
                  >
                    <Shield className="w-3.5 h-3.5" /> Save Streak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
