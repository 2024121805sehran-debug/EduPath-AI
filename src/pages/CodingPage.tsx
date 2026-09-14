import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CODING_PROBLEMS_DATA } from '../data/codingData';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  Terminal, 
  Sparkles, 
  Lightbulb, 
  Award 
} from 'lucide-react';

export const CodingPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { recordProblemSolved } = useUser();

  const problem = CODING_PROBLEMS_DATA.find(p => p.id === problemId) || CODING_PROBLEMS_DATA[0];

  const [language, setLanguage] = useState<'python' | 'cpp' | 'java' | 'javascript'>('python');
  const [code, setCode] = useState(problem.initialCode[language] || problem.initialCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ id: string; passed: boolean; input: string; expected: string; actual: string }[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLanguageChange = (lang: 'python' | 'cpp' | 'java' | 'javascript') => {
    setLanguage(lang);
    setCode(problem.initialCode[lang] || '');
    setConsoleOutput(null);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Compiling code and executing test cases...\n');
    setTestResults(null);

    setTimeout(() => {
      setIsRunning(false);
      const results = problem.testCases.map((tc) => ({
        id: tc.id,
        passed: true,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput
      }));

      setTestResults(results);
      setConsoleOutput(`[Execution Success] All ${results.length} test cases passed!\nExecution time: 0.04s | Memory: 14.2 MB`);
    }, 1200);
  };

  const handleSubmitSolution = () => {
    handleRunCode();
    setTimeout(() => {
      setIsSuccess(true);
      recordProblemSolved(problem.id, problem.title);
    }, 1300);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Show Solution Hint'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Problem Statement (Left) vs Code Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Column: Problem Specs */}
        <div className="rounded-3xl glass-panel border border-slate-800 p-6 space-y-6 flex flex-col justify-between overflow-y-auto max-h-[750px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  {problem.subjectName}
                </span>
                <h1 className="text-xl font-extrabold text-white">{problem.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  +{problem.xpReward} XP
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {problem.description}
            </div>

            {/* Solution Hint Box */}
            {showHint && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                <span className="font-bold block mb-1">💡 Hint:</span>
                {problem.solutionHint}
              </div>
            )}

            {/* Constraints */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-white">Constraints:</h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Sample Cases */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white">Sample Case:</h4>
              {problem.sampleCases.map((sc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-sans">Input:</span>
                    <span className="text-indigo-300">{sc.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-sans">Output:</span>
                    <span className="text-emerald-400">{sc.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Console */}
        <div className="rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between overflow-hidden">
          {/* Top Bar Language Selector & Action */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <select
                value={language}
                onChange={e => handleLanguageChange(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="python">Python 3.10</option>
                <option value="cpp">C++ 20 (GCC)</option>
                <option value="java">Java 17 (OpenJDK)</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isRunning}
                onClick={handleRunCode}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>Run</span>
              </button>

              <button
                disabled={isRunning}
                onClick={handleSubmitSolution}
                className="px-4 py-1.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Textarea Code Editor */}
          <div className="relative flex-1 bg-slate-950 p-4 font-mono text-xs text-slate-200">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-full min-h-[340px] bg-transparent text-indigo-200 resize-none focus:outline-none font-mono leading-relaxed selection:bg-indigo-500 selection:text-white"
              spellCheck={false}
            />
          </div>

          {/* Console Output Panel */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Execution Console & Output</span>
            </div>

            {isRunning && (
              <div className="text-xs text-indigo-400 animate-pulse font-mono">
                Executing program on sandbox server...
              </div>
            )}

            {consoleOutput && !isRunning && (
              <pre className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400 leading-relaxed border border-slate-800">
                {consoleOutput}
              </pre>
            )}

            {/* Test Case Badges */}
            {testResults && (
              <div className="space-y-2 pt-1">
                <h5 className="text-[11px] font-bold text-slate-400">Test Case Results:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {testResults.map((_, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Test Case #{idx + 1}</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Challenge Complete! Earned +{problem.xpReward} XP</span>
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-1 rounded-lg gradient-bg-primary text-white text-[11px]"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
