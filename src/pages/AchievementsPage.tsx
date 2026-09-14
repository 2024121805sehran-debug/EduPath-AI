import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { INITIAL_ACHIEVEMENTS, DEMO_LEADERBOARD } from '../data/achievementsData';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { ProgressBar } from '../components/common/ProgressBar';
import { 
  Trophy, 
  Award, 
  Lock, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Code, 
  Target 
} from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { userProgress } = useUser();
  const [filterCategory, setFilterCategory] = useState<'All' | 'Unlocked' | 'Locked' | 'Streak' | 'Quiz' | 'Coding' | 'Mastery'>('All');

  const currentLevel = Math.floor(userProgress.xp / 400) + 1;
  const xpCurrentLevel = userProgress.xp % 400;
  const xpNeededNextLevel = 400;
  const levelProgressPercent = Math.min(100, Math.round((xpCurrentLevel / xpNeededNextLevel) * 100));

  const unlockedCount = INITIAL_ACHIEVEMENTS.filter(a => a.unlocked).length;

  const filteredAchievements = INITIAL_ACHIEVEMENTS.filter(ach => {
    if (filterCategory === 'Unlocked') return ach.unlocked;
    if (filterCategory === 'Locked') return !ach.unlocked;
    if (filterCategory === 'Streak') return ach.category === 'Streak';
    if (filterCategory === 'Quiz') return ach.category === 'Quiz';
    if (filterCategory === 'Coding') return ach.category === 'Coding';
    if (filterCategory === 'Mastery') return ach.category === 'Mastery';
    return true;
  });

  const xpRules = [
    { title: 'Complete Topic', xp: '+50 XP', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Pass Quiz', xp: '+30 XP', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Perfect Quiz (100%)', xp: '+50 XP Bonus', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Solve Coding Problem', xp: '+75 XP', icon: Code, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: 'Complete Subject', xp: '+500 XP', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Level Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card-accent border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 text-center lg:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>EduPath Gamification & Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scholar Level & Achievements Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Earn experience points (XP), maintain daily study streaks, unlock badges, and climb the weekly leaderboard by mastering topics and code challenges.
          </p>
        </div>

        {/* Current Level Card */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center z-10 shrink-0 w-full sm:w-72 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400">Current Rank</span>
            <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
              Level {currentLevel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-white">Level {currentLevel} Scholar</div>
              <div className="text-xs text-indigo-300 font-bold">{userProgress.xp} Total XP</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1 text-left">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Next Level Progress</span>
              <span className="text-indigo-400 font-bold">{xpCurrentLevel} / {xpNeededNextLevel} XP</span>
            </div>
            <ProgressBar progress={levelProgressPercent} />
          </div>
        </div>
      </div>

      {/* XP Rules Quick Bar */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">XP Earning Rules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {xpRules.map((rule, idx) => {
            const IconComponent = rule.icon;
            return (
              <div key={idx} className={`p-3 rounded-2xl border ${rule.bg} flex items-center gap-3 transition-all hover:scale-[1.02]`}>
                <div className={`w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 ${rule.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-300 leading-snug">{rule.title}</div>
                  <div className={`text-xs font-black ${rule.color}`}>{rule.xp}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400">Unlocked Badges</span>
          <div className="text-2xl font-black text-white mt-1">{unlockedCount} / {INITIAL_ACHIEVEMENTS.length}</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400">Study Streak</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>{userProgress.streakDays} Days</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400">Quiz Aces</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">2 Perfect</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400">Leaderboard Rank</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">#4 Weekly</div>
        </div>
      </div>

      {/* Main Grid: Badges (Left) & Weekly Leaderboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Badges & Achievements */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Platform Badges & Achievements</span>
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(['All', 'Unlocked', 'Locked', 'Streak', 'Quiz', 'Coding', 'Mastery'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                    filterCategory === cat
                      ? 'gradient-bg-primary text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map(ach => {
              const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.totalRequired) * 100));
              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    ach.unlocked
                      ? 'glass-panel border-indigo-500/40 shadow-lg shadow-indigo-500/10 hover:border-indigo-500/60'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                        ach.unlocked
                          ? 'gradient-bg-primary text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        <DynamicIcon name={ach.iconName} className="w-5 h-5" />
                      </div>

                      {ach.unlocked ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-white mb-1">{ach.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{ach.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[11px]">Requirement</span>
                      <span className="font-bold text-indigo-300">{ach.currentProgress} / {ach.totalRequired}</span>
                    </div>
                    <ProgressBar progress={progressPercent} />
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      {ach.unlockedAt ? (
                        <span className="text-slate-500">Unlocked {ach.unlockedAt}</span>
                      ) : (
                        <span className="text-slate-500">In Progress</span>
                      )}
                      <span className="font-extrabold text-amber-400">+{ach.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Weekly Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold text-white">Weekly Leaderboard</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Ranking
            </span>
          </div>

          <div className="p-4 rounded-3xl glass-panel border border-slate-800 space-y-3">
            {DEMO_LEADERBOARD.map(user => (
              <div
                key={user.rank}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  user.isCurrentUser
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  {/* Rank Badge */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    user.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : user.rank === 2
                      ? 'bg-slate-300 text-slate-950 shadow-md'
                      : user.rank === 3
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                  </div>

                  {/* Avatar */}
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                  />

                  {/* Details */}
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="px-1.5 py-0.2 text-[9px] font-black bg-indigo-500 text-white rounded">
                          YOU
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{user.courseAbbr}</p>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-indigo-300">{user.weeklyXp} XP</div>
                  <div className="text-[10px] text-amber-400 flex items-center justify-end gap-0.5 font-semibold">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{user.streakDays}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
