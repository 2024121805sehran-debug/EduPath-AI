import React from 'react';
import { Play, Send, RotateCcw, Terminal } from 'lucide-react';

interface CodeEditorProps {
  language: 'cpp' | 'python' | 'java';
  onLanguageChange: (lang: 'cpp' | 'python' | 'java') => void;
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  onSubmitCode: () => void;
  onResetCode: () => void;
  isExecuting: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onRunCode,
  onSubmitCode,
  onResetCode,
  isExecuting
}) => {
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden flex flex-col h-[520px] shadow-2xl">
      {/* Top Toolbar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Language:</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => onLanguageChange('python')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'python'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => onLanguageChange('cpp')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'cpp'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              C++
            </button>
            <button
              onClick={() => onLanguageChange('java')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'java'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Java
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetCode}
            title="Reset code template"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={isExecuting}
            onClick={onRunCode}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Run Code</span>
          </button>

          <button
            disabled={isExecuting}
            onClick={onSubmitCode}
            className="px-5 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden bg-slate-950/90 font-mono text-xs sm:text-sm relative">
        {/* Line Numbers Column */}
        <div className="w-10 sm:w-12 bg-slate-900/40 border-r border-slate-800/80 py-3 text-right pr-3 select-none text-slate-600 font-mono">
          {lineNumbers.map(n => (
            <div key={n} className="leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-indigo-200 focus:outline-none resize-none font-mono leading-6 overflow-y-auto selection:bg-indigo-600/40"
          placeholder="Write your solution here..."
        />
      </div>
    </div>
  );
};
