import React from 'react';
import { useUser } from '../../context/UserContext';
import { Flame, Award, BookCheck, Code2, HelpCircle } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { userProgress } = useUser();

  const completedQuizCount = Object.keys(userProgress.completedQuizScores).length;

  const stats = [
    {
      label: 'Learning Streak',
      value: `${userProgress.streakDays} Days`,
      subText: 'Consecutive activity',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Total XP',
      value: `${userProgress.xp} XP`,
      subText: `Level ${userProgress.level} Scholar`,
      icon: Award,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Topics Mastered',
      value: `${userProgress.completedTopicIds.length}`,
      subText: 'Syllabus modules done',
      icon: BookCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Quizzes Completed',
      value: `${completedQuizCount}`,
      subText: 'Assessment passes',
      icon: HelpCircle,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Coding Challenges',
      value: `${userProgress.solvedProblemIds.length}`,
      subText: 'Problems solved',
      icon: Code2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-0.5">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{stat.subText}</p>
          </div>
        );
      })}
    </div>
  );
};
