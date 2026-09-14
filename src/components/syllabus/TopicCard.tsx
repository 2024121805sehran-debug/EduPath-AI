import React from 'react';
import type { Topic } from '../../types';
import { CheckCircle2, Circle, Clock, HelpCircle, ChevronRight } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  subjectId: string;
  isCompleted: boolean;
  onToggleComplete: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isCompleted,
  onToggleComplete,
  onClick
}) => {
  const getDifficultyBadge = (diff: Topic['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleComplete}
          className="shrink-0"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
          ) : (
            <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400 transition-colors" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
              isCompleted ? 'text-slate-400 line-through' : 'text-white group-hover:text-indigo-300'
            }`}>
              {topic.title}
            </h4>

            <span className={`px-2 py-0.2 text-[10px] font-semibold border rounded ${getDifficultyBadge(topic.difficulty)}`}>
              {topic.difficulty}
            </span>

            {topic.hasQuiz && (
              <span className="px-2 py-0.2 text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                Quiz Available
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 line-clamp-1">
            {topic.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {topic.estimatedMinutes}m
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  );
};
