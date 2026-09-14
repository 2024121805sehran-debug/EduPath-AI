import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Subject, Topic } from '../../types';
import { useUser } from '../../context/UserContext';
import { ProgressBar } from '../common/ProgressBar';
import { DynamicIcon } from '../common/DynamicIcon';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SubjectProgressCardProps {
  subject: Subject;
}

export const SubjectProgressCard: React.FC<SubjectProgressCardProps> = ({ subject }) => {
  const { userProgress, getSubjectProgress } = useUser();
  const navigate = useNavigate();

  // Calculate completed topics vs total topics
  let allTopics: Topic[] = [];
  subject.units.forEach(unit => {
    allTopics.push(...unit.topics);
  });

  const completedCount = allTopics.filter(t => userProgress.completedTopicIds.includes(t.id)).length;
  const totalTopics = allTopics.length || 1;
  const progressPercent = getSubjectProgress(subject.id);

  // Find next uncompleted topic or default to first topic
  const nextTopic = allTopics.find(t => !userProgress.completedTopicIds.includes(t.id)) || allTopics[0];

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <DynamicIcon name={subject.iconName} className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{subject.code}</span>
              <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                {subject.name}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
            {subject.credits} Credits
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {subject.description}
        </p>

        {/* Progress Metrics */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completedCount} / {totalTopics} Topics Done</span>
            </span>
            <span className="font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <ProgressBar progress={progressPercent} />
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 line-clamp-1">
          {nextTopic ? `Next: ${nextTopic.title}` : 'All units completed!'}
        </span>
        <button
          onClick={() => {
            if (nextTopic) {
              navigate(`/subjects/${subject.id}/topics/${nextTopic.id}`);
            } else {
              navigate(`/subjects/${subject.id}`);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all shadow-sm"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
