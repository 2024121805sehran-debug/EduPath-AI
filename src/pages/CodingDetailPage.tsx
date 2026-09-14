import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CODING_PROBLEMS_DATA } from '../data/codingData';
import { executeDemoCode, type ExecutionResult } from '../services/codeExecutionService';
import { CodeEditor } from '../components/coding/CodeEditor';
import { TestCaseRunner } from '../components/coding/TestCaseRunner';
import { 
  ArrowLeft, 
  Lightbulb, 
  CheckCircle2, 
  Award
} from 'lucide-react';

export const CodingDetailPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { userProgress, recordProblemSolved } = useUser();

  const problem = CODING_PROBLEMS_DATA.find(p => p.id === problemId) || CODING_PROBLEMS_DATA[0];

  const [language, setLanguage] = useState<'cpp' | 'python' | 'java'>('python');
  const [code, setCode] = useState<string>(problem.initialCode[language] || problem.initialCode.python);
  const [showHint, setShowHint] = useState<boolean>(false);

  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const isSolved = userProgress.solvedProblemIds.includes(problem.id);

  const handleLanguageChange = (newLang: 'cpp' | 'python' | 'java') => {
    setLanguage(newLang);
    setCode(problem.initialCode[newLang] || problem.initialCode.python);
    setExecutionResult(null);
  };

  const handleResetCode = () => {
    setCode(problem.initialCode[language] || problem.initialCode.python);
    setExecutionResult(null);
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = executeDemoCode(problem, language, code);
      setExecutionResult(res);
      setIsExecuting(false);
    }, 600);
  };

  const handleSubmitCode = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = executeDemoCode(problem, language, code);
      setExecutionResult(res);
      setIsExecuting(false);

      if (res.accepted) {
        recordProblemSolved(problem.id, problem.title);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/coding')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem List</span>
        </button>

        <div className="flex items-center gap-3">
          {isSolved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Solved (+{problem.xpReward} XP)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 h-full overflow-y-auto max-h-[800px] shadow-xl">
            {/* Title & Metadata */}
            <div className="space-y-3 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                  {problem.category}
                </span>
                <span
                  className={`px-2 py-0.2 text-[10px] font-bold border rounded ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  +{problem.xpReward} XP
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {problem.title}
              </h1>
            </div>

            {/* Description Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap">{problem.description}</div>

              {/* Input Format */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Format</h4>
                <p className="text-xs text-slate-300">{problem.inputFormat}</p>
              </div>

              {/* Output Format */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Output Format</h4>
                <p className="text-xs text-slate-300">{problem.outputFormat}</p>
              </div>

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h4>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-300 font-mono">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hint Toggle */}
              {problem.solutionHint && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowHint(prev => !prev)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Show Solution Hint'}</span>
                  </button>

                  {showHint && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed animate-fade-in font-sans">
                      <span className="font-bold">Hint: </span>
                      {problem.solutionHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Case Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CodeEditor
            language={language}
            onLanguageChange={handleLanguageChange}
            code={code}
            onCodeChange={setCode}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitCode}
            onResetCode={handleResetCode}
            isExecuting={isExecuting}
          />

          <TestCaseRunner
            problem={problem}
            executionResult={executionResult}
            isExecuting={isExecuting}
          />
        </div>
      </div>
    </div>
  );
};
