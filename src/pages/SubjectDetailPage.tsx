import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { ProgressBar } from '../components/common/ProgressBar';
import { UnitCard } from '../components/syllabus/UnitCard';
import { TopicCard } from '../components/syllabus/TopicCard';
import { SubjectCompletionModal } from '../components/completion/CompletionModals';
import { QUIZZES_DATA } from '../data/quizzesData';
import { CODING_PROBLEMS_DATA } from '../data/codingData';
import type { Subject, Unit, Topic } from '../types';
import { 
  ArrowLeft, 
  HelpCircle, 
  Code2, 
  Info,
  Trophy,
  CheckCircle2
} from 'lucide-react';

export const SubjectDetailPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { activeCourse, userProgress, getSubjectProgress, markTopicCompleted, completeSubject } = useUser();

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Find subject across all course years/semesters
  let subjectObj: Subject | null = null;
  activeCourse.years.forEach(y => {
    y.semesters.forEach(s => {
      s.subjects.forEach(sub => {
        if (sub.id === subjectId) subjectObj = sub;
      });
    });
  });

  if (!subjectObj) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Subject Not Found</h2>
        <button
          onClick={() => navigate('/subjects')}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold"
        >
          Return to Subject Directory
        </button>
      </div>
    );
  }

  const currentSubject: Subject = subjectObj;
  const progress = getSubjectProgress(currentSubject.id);
  const isFullyCompleted = progress >= 100;

  // Find quizzes and coding problems for this subject
  const subjectQuizzes = QUIZZES_DATA.filter(q => q.subjectId === currentSubject.id);
  const subjectCoding = CODING_PROBLEMS_DATA.filter(c => c.subjectId === currentSubject.id);

  let allTopicsCount = 0;
  currentSubject.units.forEach(u => allTopicsCount += u.topics.length);

  const handleTriggerSubjectCompletion = () => {
    completeSubject(currentSubject.id, currentSubject.name);
    setShowCompletionModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Curriculum syllabus for {activeCourse.abbreviation} • Year {userProgress.selectedYear} Sem {userProgress.selectedSemester}</span>
        </div>
        {isFullyCompleted && (
          <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            100% Subject Mastered
          </span>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/subjects')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Subject Directory</span>
      </button>

      {/* Subject Header Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
              <DynamicIcon name={currentSubject.iconName} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  {currentSubject.code}
                </span>
                <span className="text-xs text-slate-400">Sem {currentSubject.semesterId}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{currentSubject.credits} Credits</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentSubject.name}
              </h1>
              {currentSubject.instructor && (
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Instructor: <span className="text-slate-300">{currentSubject.instructor}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Quiz & IDE Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {subjectQuizzes.length > 0 && (
              <button
                onClick={() => navigate(`/quiz/${subjectQuizzes[0].id}`)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Subject Quiz</span>
              </button>
            )}

            {subjectCoding.length > 0 && (
              <button
                onClick={() => navigate(`/coding/${subjectCoding[0].id}`)}
                className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                <span>Practice Code IDE</span>
              </button>
            )}

            <button
              onClick={handleTriggerSubjectCompletion}
              className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{isFullyCompleted ? 'View Certificate & Report' : 'Claim Completion Report'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {currentSubject.description}
        </p>

        {/* Progress Bar */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 max-w-xl">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Overall Subject Progress</span>
            <span className="font-bold text-indigo-400">{progress}% Complete</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Syllabus Units Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Syllabus Units ({currentSubject.units.length} Modules)
        </h2>

        <div className="space-y-6">
          {currentSubject.units.map((unit: Unit) => (
            <UnitCard key={unit.id || unit.unitNumber} unit={unit}>
              {unit.topics.map((topic: Topic) => {
                const isCompleted = userProgress.completedTopicIds.includes(topic.id);
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    subjectId={currentSubject.id}
                    isCompleted={isCompleted}
                    onToggleComplete={e => {
                      e.stopPropagation();
                      markTopicCompleted(topic.id, topic.title);
                    }}
                    onClick={() => navigate(`/subjects/${currentSubject.id}/topics/${topic.id}`)}
                  />
                );
              })}
            </UnitCard>
          ))}
        </div>
      </div>

      {/* Subject Completion Modal */}
      {showCompletionModal && (
        <SubjectCompletionModal
          studentName={userProgress.studentName}
          subject={currentSubject}
          finalScorePercent={Math.max(85, progress)}
          topicsCount={allTopicsCount}
          quizScorePercent={88}
          codingAccuracyPercent={90}
          onClose={() => setShowCompletionModal(false)}
          onContinue={() => {
            setShowCompletionModal(false);
            navigate('/subjects');
          }}
        />
      )}
    </div>
  );
};
