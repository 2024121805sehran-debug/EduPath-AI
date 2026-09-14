import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { HelpCircle, Code2, PlayCircle, Clock, ArrowUpRight } from 'lucide-react';

export const UpcomingTasks: React.FC = () => {
  const { getAllSubjectsForCurrentSem } = useUser();
  const navigate = useNavigate();

  const currentSubjects = getAllSubjectsForCurrentSem();

  const getRecommendedTasks = () => {
    if (currentSubjects.length === 0) return [];

    const sub1 = currentSubjects[0];
    const sub2 = currentSubjects[1] || currentSubjects[0];
    const sub3 = currentSubjects[2] || currentSubjects[0];

    const topic1 = sub1?.units[0]?.topics[0];
    const topic2 = sub2?.units[0]?.topics[0] || sub2?.units[0]?.topics[1];
    const topic3 = sub3?.units[0]?.topics[0] || sub3?.units[0]?.topics[2];

    return [
      {
        id: `task-1-${sub1.id}`,
        title: topic1?.title || `${sub1.name} Core Principles`,
        subtitle: `${sub1.code} • ${sub1.name}`,
        duration: `${topic1?.estimatedMinutes || 25} Mins`,
        badge: 'Recommended',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: PlayCircle,
        action: () => navigate(`/subjects/${sub1.id}`)
      },
      {
        id: `task-2-${sub2.id}`,
        title: `${sub2.name} Self-Assessment`,
        subtitle: `${topic2?.title || 'Module Quiz'} • 150 XP`,
        duration: '15 Mins',
        badge: 'High XP',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: HelpCircle,
        action: () => navigate(`/subjects/${sub2.id}`)
      },
      {
        id: `task-3-${sub3.id}`,
        title: topic3?.title || `${sub3.name} Practical Review`,
        subtitle: `Unit I: ${sub3.units[0]?.title.split(':')[1] || 'Fundamentals'}`,
        duration: '20 Mins',
        badge: 'Core Unit',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: Code2,
        action: () => navigate(`/subjects/${sub3.id}`)
      }
    ];
  };

  const recommendedTasks = getRecommendedTasks();

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Recommended Learning Tasks</h3>
          <p className="text-xs text-slate-400">Curated path to maximize semester performance</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendedTasks.map(task => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              onClick={task.action}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </span>
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold border rounded ${task.badgeColor}`}>
                      {task.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{task.subtitle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {task.duration}
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
