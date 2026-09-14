import React from 'react';
import { Briefcase, FileText, AlertTriangle } from 'lucide-react';

interface ScenarioQuestionViewProps {
  scenarioDetails?: {
    context: string;
    role: string;
    challenge: string;
  };
}

export const ScenarioQuestionView: React.FC<ScenarioQuestionViewProps> = ({ scenarioDetails }) => {
  if (!scenarioDetails) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3 font-sans">
      <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
        <Briefcase className="w-4 h-4 text-indigo-400" />
        <span>Real-World Applied Case Scenario</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Role / Context</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-semibold">{scenarioDetails.role}</p>
          <p className="text-slate-400 leading-relaxed">{scenarioDetails.context}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Challenge</span>
          </div>
          <p className="text-slate-200 leading-relaxed">{scenarioDetails.challenge}</p>
        </div>
      </div>
    </div>
  );
};
