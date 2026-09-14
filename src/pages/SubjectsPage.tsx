import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { Subject } from '../types';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { ProgressBar } from '../components/common/ProgressBar';
import { SemesterCompletionModal } from '../components/completion/CompletionModals';
import { Search, BookOpen, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const { activeCourse, userProgress, getSubjectProgress, setOnboardingData } = useUser();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemFilter, setSelectedSemFilter] = useState<number | 'all'>(userProgress.selectedSemester);
  const [showSemModal, setShowSemModal] = useState(false);

  // Extract all subjects from active course
  let allCourseSubjects: Subject[] = [];
  activeCourse.years.forEach(year => {
    year.semesters.forEach(sem => {
      allCourseSubjects.push(...sem.subjects);
    });
  });

  const filteredSubjects = allCourseSubjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem = selectedSemFilter === 'all' || sub.semesterId === Number(selectedSemFilter);
    return matchesSearch && matchesSem;
  });

  const currentSemSubjects = typeof selectedSemFilter === 'number' 
    ? allCourseSubjects.filter(s => s.semesterId === selectedSemFilter)
    : [];

  const isSemFullyCompleted = currentSemSubjects.length > 0 && currentSemSubjects.every(s => getSubjectProgress(s.id) >= 100);

  const handleNextSemester = () => {
    setShowSemModal(false);
    const nextSem = Math.min(activeCourse.totalSemesters, userProgress.selectedSemester + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    const nextYear = Math.ceil(nextSem / 2) as 1 | 2 | 3 | 4;
    setOnboardingData(activeCourse.id, nextYear, nextSem);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Subject Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all core and elective subjects for <span className="text-indigo-400 font-bold">{activeCourse.name}</span>
          </p>
        </div>

        {/* Search Input & Action */}
        <div className="flex items-center gap-3">
          {isSemFullyCompleted && typeof selectedSemFilter === 'number' && (
            <button
              onClick={() => setShowSemModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Claim Sem {selectedSemFilter} Certificate</span>
            </button>
          )}

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSemFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedSemFilter === 'all'
              ? 'gradient-bg-primary text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Semesters
        </button>
        {Array.from({ length: activeCourse.totalSemesters }).map((_, idx) => {
          const sem = idx + 1;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemFilter(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSemFilter === sem
                  ? 'gradient-bg-primary text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Sem {sem}
            </button>
          );
        })}
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map(sub => {
            const progress = getSubjectProgress(sub.id);
            const isDone = progress >= 100;
            return (
              <div
                key={sub.id}
                onClick={() => navigate(`/subjects/${sub.id}`)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'glass-panel border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700 rounded-md">
                      {sub.code} • Sem {sub.semesterId}
                    </span>
                    {isDone ? (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                        {sub.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                      <DynamicIcon name={sub.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {sub.name}
                      </h3>
                      {sub.instructor && (
                        <p className="text-[11px] text-slate-500">{sub.instructor}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[11px]">Syllabus Mastery</span>
                      <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-indigo-400'}`}>{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">{sub.units.length} Units Included</span>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 group-hover:gradient-bg-primary text-slate-300 group-hover:text-white text-xs font-bold transition-all">
                      <span>{isDone ? 'View Certificate' : 'View Syllabus'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center glass-panel rounded-2xl space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No subjects match your query</h4>
            <p className="text-xs text-slate-400">Try clearing your search keyword or selecting "All Semesters".</p>
          </div>
        )}
      </div>

      {/* Semester Completion Modal */}
      {showSemModal && typeof selectedSemFilter === 'number' && (
        <SemesterCompletionModal
          studentName={userProgress.studentName}
          courseName={activeCourse.name}
          semesterNumber={selectedSemFilter}
          subjects={currentSemSubjects}
          streakDays={userProgress.streakDays}
          onClose={() => setShowSemModal(false)}
          onNextSemester={handleNextSemester}
        />
      )}
    </div>
  );
};
