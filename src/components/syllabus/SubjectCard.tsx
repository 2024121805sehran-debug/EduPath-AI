import React from 'react';
import type { Subject } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { ProgressBar } from '../common/ProgressBar';
import { ArrowRight } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, progress, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex flex-col justify-between transition-all group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700 rounded-md">
            {subject.code} • Sem {subject.semesterId}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
            {subject.category}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
            <DynamicIcon name={subject.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              {subject.name}
            </h3>
            {subject.instructor && (
              <p className="text-[11px] text-slate-500">{subject.instructor}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed">
          {subject.description}
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 text-[11px]">Syllabus Progress</span>
            <span className="font-bold text-indigo-400">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">{subject.units.length} Units Included</span>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 group-hover:gradient-bg-primary text-slate-300 group-hover:text-white text-xs font-bold transition-all">
            <span>View Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
