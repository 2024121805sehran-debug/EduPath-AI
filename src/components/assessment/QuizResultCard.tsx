import React from 'react';
import type { Quiz, QuizQuestion } from '../../types';
import { 
  Award, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';

interface QuizResultCardProps {
  quiz: Quiz;
  userAnswers: Record<number, any>;
  timeTakenSeconds: number;
  onRetry: () => void;
  onReviewTopic: () => void;
  onContinue: () => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({
  quiz,
  userAnswers,
  timeTakenSeconds,
  onRetry,
  onReviewTopic,
  onContinue
}) => {
  // Calculate correctness for each question
  let correctCount = 0;
  const strongTopicsSet = new Set<string>();
  const weakTopicsSet = new Set<string>();

  quiz.questions.forEach((q: QuizQuestion, idx: number) => {
    const userAns = userAnswers[idx];
    let isQCorrect = false;

    if (q.type === 'mcq' || q.type === 'true_false' || q.type === 'scenario' || q.type === 'coding') {
      isQCorrect = userAns === q.correctAnswer;
    } else if (q.type === 'puzzle') {
      if (q.puzzleData?.puzzleType === 'matching' && q.puzzleData.correctPairs) {
        const target = q.puzzleData.correctPairs;
        isQCorrect = userAns && typeof userAns === 'object' &&
          Object.keys(target).every(k => userAns[k] === target[k]);
      } else if (q.puzzleData?.puzzleType === 'ordering' && q.puzzleData.orderedSteps) {
        isQCorrect = Array.isArray(userAns) && 
          userAns.join('||') === q.puzzleData.orderedSteps.join('||');
      }
    }

    const tag = q.categoryTag || quiz.title;
    if (isQCorrect) {
      correctCount++;
      strongTopicsSet.add(tag);
    } else {
      weakTopicsSet.add(tag);
    }
  });

  const totalQ = quiz.questions.length;
  const scorePercent = Math.round((correctCount / totalQ) * 100);
  const passingScore = quiz.passingScore || 70;
  const passed = scorePercent >= passingScore;

  const strongTopics = Array.from(strongTopicsSet);
  const weakTopics = Array.from(weakTopicsSet);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-800 text-center space-y-8 animate-fade-in max-w-2xl mx-auto shadow-2xl">
      {/* Header Badge */}
      <div className="space-y-3">
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105 ${
            passed
              ? 'gradient-bg-primary ring-4 ring-indigo-500/20'
              : 'bg-rose-500/20 border border-rose-500/30 text-rose-400 ring-4 ring-rose-500/10'
          }`}
        >
          {passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10 text-rose-400" />}
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assessment Report</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {passed ? 'Quiz Complete 🎉' : 'Assessment Incomplete'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {passed
              ? `Congratulations! You scored ${scorePercent}% and passed the required passing threshold (${passingScore}%).`
              : `You scored ${scorePercent}%. You need at least ${passingScore}% to pass this assessment and complete the topic.`}
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
          <p className="text-2xl font-black text-indigo-400">{scorePercent}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</span>
          <p className="text-2xl font-black text-emerald-400">
            {correctCount} / {totalQ}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3 text-cyan-400" />
            Accuracy
          </span>
          <p className="text-2xl font-black text-cyan-300">{scorePercent}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Time Taken
          </span>
          <p className="text-xl font-bold text-slate-200 mt-1">{formatTime(timeTakenSeconds)}</p>
        </div>
      </div>

      {/* Strong Areas & Needs Practice Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
        {/* Strong Areas */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Areas</span>
          </div>
          {strongTopics.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {strongTopics.map((topic, i) => (
                <li key={i} className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No strong topics recorded in this run.</p>
          )}
        </div>

        {/* Needs Practice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Topics That Need Revision</span>
          </div>
          {weakTopics.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {weakTopics.map((topic, i) => (
                <li key={i} className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-400 font-bold">Mastered all topics in this assessment! 🌟</p>
          )}
        </div>
      </div>

      {/* XP Reward Card */}
      <div className="p-4 rounded-2xl glass-card-accent border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-indigo-400 shrink-0" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-white">Experience Points Earned</h4>
            <p className="text-[11px] text-slate-400">
              {passed ? 'Assessment passed! Added to total student rank XP.' : 'Participation XP awarded.'}
            </p>
          </div>
        </div>
        <span className="text-base font-extrabold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30">
          +{passed ? quiz.xpReward : 20} XP
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Quiz</span>
        </button>

        <button
          onClick={onReviewTopic}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review Topic</span>
        </button>

        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
