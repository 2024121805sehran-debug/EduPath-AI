import React, { useState } from 'react';
import type { ExecutionResult } from '../../services/codeExecutionService';
import type { CodingProblem } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Terminal, 
  FileText
} from 'lucide-react';

interface TestCaseRunnerProps {
  problem: CodingProblem;
  executionResult: ExecutionResult | null;
  isExecuting: boolean;
}

export const TestCaseRunner: React.FC<TestCaseRunnerProps> = ({
  problem,
  executionResult,
  isExecuting
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'results'>('samples');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  return (
    <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden space-y-4 p-4 sm:p-6 shadow-xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sample Test Cases</span>
          </button>

          {executionResult && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Execution Results</span>
            </button>
          )}
        </div>

        {/* Execution Metrics if available */}
        {executionResult && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{executionResult.executionTimeMs} ms</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{executionResult.memoryUsageMb} MB</span>
            </div>
          </div>
        )}
      </div>

      {isExecuting ? (
        <div className="p-8 text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Executing test cases in sandbox...</p>
        </div>
      ) : activeTab === 'results' && executionResult ? (
        /* Results View */
        <div className="space-y-4">
          {/* Result Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              executionResult.accepted
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {executionResult.accepted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-extrabold">
                  {executionResult.accepted ? 'Accepted ✓' : 'Some test cases failed'}
                </h4>
                <p className="text-xs opacity-90">
                  Passed {executionResult.passedCount} of {executionResult.totalCount} test cases
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800">
              {executionResult.passedCount} / {executionResult.totalCount} Passed
            </span>
          </div>

          {/* Test Case Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {executionResult.testResults.map((tr, idx) => (
              <button
                key={tr.id}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shrink-0 ${
                  selectedCaseIdx === idx
                    ? 'bg-slate-800 text-white border-slate-700 ring-1 ring-slate-600'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${tr.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span>Case {idx + 1}</span>
                {tr.isHidden && <span className="text-[10px] text-slate-500">(Hidden)</span>}
              </button>
            ))}
          </div>

          {/* Case Detail Box */}
          {executionResult.testResults[selectedCaseIdx] && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Input</span>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 overflow-x-auto">
                  {executionResult.testResults[selectedCaseIdx].isHidden
                    ? '[Hidden Test Case Input]'
                    : executionResult.testResults[selectedCaseIdx].input}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Expected Output</span>
                  <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 overflow-x-auto">
                    {executionResult.testResults[selectedCaseIdx].expectedOutput}
                  </pre>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Actual Output</span>
                  <pre
                    className={`p-2.5 rounded-xl bg-slate-900 overflow-x-auto ${
                      executionResult.testResults[selectedCaseIdx].passed
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                    }`}
                  >
                    {executionResult.testResults[selectedCaseIdx].actualOutput}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Sample Cases View */
        <div className="space-y-3">
          {problem.sampleCases.map((sc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-indigo-400 font-sans">Sample Case {idx + 1}</span>
              <div>
                <span className="text-slate-500 block mb-1 font-bold">Input:</span>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 overflow-x-auto">{sc.input}</pre>
              </div>
              <div>
                <span className="text-slate-500 block mb-1 font-bold">Output:</span>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 overflow-x-auto">{sc.output}</pre>
              </div>
              {sc.explanation && (
                <p className="text-[11px] text-slate-400 font-sans italic pt-1">
                  <span className="font-semibold text-slate-300">Explanation: </span>
                  {sc.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
