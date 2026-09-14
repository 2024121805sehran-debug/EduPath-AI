import React from 'react';
import { Code, CheckCircle2 } from 'lucide-react';

interface OptionSelectorProps {
  options: string[];
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isSubmitted: boolean;
  correctAnswer?: number;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedOption,
  onSelectOption,
  isSubmitted,
  correctAnswer,
  codeSnippet
}) => {
  return (
    <div className="space-y-4">
      {/* Code snippet display if present */}
      {codeSnippet && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 font-bold flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Code Analysis Snippet ({codeSnippet.language})</span>
          </div>
          <pre className="p-4 text-indigo-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {codeSnippet.code}
          </pre>
        </div>
      )}

      {/* Options grid */}
      <div className="space-y-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSubmitted && correctAnswer === idx;
          const isWrong = isSubmitted && isSelected && correctAnswer !== idx;

          let optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
            } else if (isWrong) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500';
            } else {
              optionStyle = 'bg-slate-900/30 border-slate-800/60 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500 shadow-md';
          }

          return (
            <div
              key={idx}
              onClick={() => !isSubmitted && onSelectOption(idx)}
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
              </div>

              {isSubmitted && isCorrect && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Correct Answer
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
