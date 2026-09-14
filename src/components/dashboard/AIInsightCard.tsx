import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AIInsightCard: React.FC = () => {
  const { getAllSubjectsForCurrentSem, getSubjectProgress } = useUser();
  const navigate = useNavigate();

  const currentSubjects = getAllSubjectsForCurrentSem();

  let strongestSubject = currentSubjects[0]?.name || 'Current Course Modules';
  let focusSubject = currentSubjects[1]?.name || currentSubjects[0]?.name || 'Syllabus Revision';

  if (currentSubjects.length > 0) {
    const sorted = [...currentSubjects].sort((a, b) => {
      const progA = getSubjectProgress(a.id);
      const progB = getSubjectProgress(b.id);
      return progB - progA;
    });

    strongestSubject = sorted[0].name;
    focusSubject = sorted[sorted.length - 1].name;
    if (sorted.length > 1 && strongestSubject === focusSubject) {
      focusSubject = sorted[1].name;
    }
  }

  const highlight = `Your strongest subject is ${strongestSubject}, while ${focusSubject} needs more attention.`;
  const recommendation = `We recommend revising core concepts in ${focusSubject} and attempting a 10-minute module quiz to boost your confidence.`;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card-accent p-5 sm:p-6 border border-indigo-500/30 shadow-xl shadow-indigo-500/10">
      {/* Background ambient glow effect */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span>AI Learning Insight</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {highlight}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {recommendation}
          </p>
        </div>

        <button
          onClick={() => navigate('/subjects')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap"
        >
          <span>View Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
