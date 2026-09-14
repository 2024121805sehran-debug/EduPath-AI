import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface LearningObjectivesProps {
  objectives: string[];
}

export const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives }) => {
  if (!objectives || objectives.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
      <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
        <Target className="w-4 h-4 text-indigo-400" />
        <span>Learning Objectives</span>
      </div>
      <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
        {objectives.map((obj, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
