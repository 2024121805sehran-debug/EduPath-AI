import React, { useState, useEffect } from 'react';
import type { Quiz, QuizQuestion } from '../../types';
import { OptionSelector } from './OptionSelector';
import { ScenarioQuestionView } from './ScenarioQuestionView';
import { PuzzleViewer } from './PuzzleViewer';
import { InstantFeedbackCard } from './InstantFeedbackCard';
import { QuizResultCard } from './QuizResultCard';
import { ProgressBar } from '../common/ProgressBar';
import { 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface QuizRunnerProps {
  quiz: Quiz;
  onQuizComplete: (result: {
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  }) => void;
  onExit: () => void;
  onReviewTopic?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  onQuizComplete,
  onExit,
  onReviewTopic
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((quiz.durationMinutes || 10) * 60);

  useEffect(() => {
    if (isQuizCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isQuizCompleted]);

  const currentQ: QuizQuestion = quiz.questions[currentIdx];
  const isCurrentSubmitted = Boolean(submittedQuestions[currentIdx]);
  const currentAnswer = userAnswers[currentIdx];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswerChange = (ans: any) => {
    if (isCurrentSubmitted || isQuizCompleted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIdx]: ans
    }));
  };

  const handleConfirmAnswer = () => {
    if (currentAnswer === undefined || currentAnswer === null) return;
    setSubmittedQuestions(prev => ({
      ...prev,
      [currentIdx]: true
    }));
  };

  const checkIsQuestionCorrect = (qIdx: number): boolean => {
    const q = quiz.questions[qIdx];
    const uAns = userAnswers[qIdx];
    if (uAns === undefined || uAns === null) return false;

    if (q.type === 'mcq' || q.type === 'true_false' || q.type === 'scenario' || q.type === 'coding') {
      return uAns === q.correctAnswer;
    } else if (q.type === 'puzzle') {
      if (q.puzzleData?.puzzleType === 'matching' && q.puzzleData.correctPairs) {
        const target = q.puzzleData.correctPairs;
        return typeof uAns === 'object' && Object.keys(target).every(k => uAns[k] === target[k]);
      } else if (q.puzzleData?.puzzleType === 'ordering' && q.puzzleData.orderedSteps) {
        return Array.isArray(uAns) && uAns.join('||') === q.puzzleData.orderedSteps.join('||');
      }
    }
    return false;
  };

  const handleSubmitWholeQuiz = () => {
    // Mark current question submitted if not already
    const updatedSubmitted = { ...submittedQuestions, [currentIdx]: true };
    setSubmittedQuestions(updatedSubmitted);
    setIsQuizCompleted(true);

    let correctCount = 0;
    quiz.questions.forEach((_, idx) => {
      if (checkIsQuestionCorrect(idx)) correctCount++;
    });

    const totalQ = quiz.questions.length;
    const scorePercent = Math.round((correctCount / totalQ) * 100);
    const passingScore = quiz.passingScore || 70;
    const passed = scorePercent >= passingScore;

    onQuizComplete({
      scorePercent,
      passed,
      correctCount,
      totalQuestions: totalQ,
      timeTakenSeconds: elapsedSeconds
    });
  };

  if (isQuizCompleted) {
    return (
      <QuizResultCard
        quiz={quiz}
        userAnswers={userAnswers}
        timeTakenSeconds={elapsedSeconds}
        onRetry={() => {
          setIsQuizCompleted(false);
          setCurrentIdx(0);
          setUserAnswers({});
          setSubmittedQuestions({});
          setElapsedSeconds(0);
          setTimeLeftSeconds((quiz.durationMinutes || 10) * 60);
        }}
        onReviewTopic={onReviewTopic || onExit}
        onContinue={onExit}
      />
    );
  }

  const progressPercent = Math.round(((currentIdx + 1) / quiz.questions.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Quiz Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Assessment</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Time: {formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Quiz Workspace Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
        {/* Question Header & Progress */}
        <div className="space-y-4 border-b border-slate-800 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                {quiz.subjectName} • {quiz.title}
              </span>
              <h2 className="text-xs text-slate-400 font-medium">Topic Assessment Module</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                Type: {currentQ.type.toUpperCase()}
              </span>
              <span className="px-3 py-1 text-xs font-extrabold bg-slate-800 text-slate-200 border border-slate-700 rounded-xl">
                Question {currentIdx + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar progress={progressPercent} />
        </div>

        {/* Question Content & Input */}
        <div className="space-y-5">
          {/* Question Text */}
          <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Scenario Details if applicable */}
          {currentQ.type === 'scenario' && (
            <ScenarioQuestionView scenarioDetails={currentQ.scenarioDetails} />
          )}

          {/* Options / Puzzle Body */}
          {currentQ.type === 'puzzle' && currentQ.puzzleData ? (
            <PuzzleViewer
              puzzleData={currentQ.puzzleData}
              isSubmitted={isCurrentSubmitted}
              onAnswerChange={handleAnswerChange}
            />
          ) : (
            <OptionSelector
              options={currentQ.options || ['True', 'False']}
              selectedOption={currentAnswer}
              onSelectOption={idx => {
                handleAnswerChange(idx);
                // Confirm answer immediately for fluid interactivity
                if (!isCurrentSubmitted) {
                  setSubmittedQuestions(prev => ({ ...prev, [currentIdx]: true }));
                }
              }}
              isSubmitted={isCurrentSubmitted}
              correctAnswer={currentQ.correctAnswer as number}
              codeSnippet={currentQ.codeSnippet}
            />
          )}

          {/* Instant Feedback Card when submitted */}
          {isCurrentSubmitted && (
            <InstantFeedbackCard
              isCorrect={checkIsQuestionCorrect(currentIdx)}
              explanation={currentQ.explanation}
            />
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-center gap-3">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-xs hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            {/* Answer Confirmation button for puzzles */}
            {currentQ.type === 'puzzle' && !isCurrentSubmitted && (
              <button
                disabled={currentAnswer === undefined}
                onClick={handleConfirmAnswer}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all disabled:opacity-40"
              >
                Check Answer
              </button>
            )}

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                disabled={!isCurrentSubmitted}
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md hover:scale-105 disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={!isCurrentSubmitted}
                onClick={handleSubmitWholeQuiz}
                className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit & View Results</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
