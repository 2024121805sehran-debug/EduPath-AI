import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface InstantFeedbackCardProps {
  isCorrect: boolean;
  explanation: string;
}

export const InstantFeedbackCard: React.FC<InstantFeedbackCardProps> = ({
  isCorrect,
  explanation
}) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border animate-fade-in space-y-2 ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
      }`}
    >
      <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
        {isCorrect ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-emerald-300">Correct! Great job.</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-rose-300">Not quite. Review this concept.</span>
          </>
        )}
      </div>

      <div className="pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Explanation: </span>
          {explanation}
        </div>
      </div>
    </div>
  );
};
