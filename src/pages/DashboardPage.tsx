import React from 'react';
import { useUser } from '../context/UserContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { AIInsightCard } from '../components/dashboard/AIInsightCard';
import { SubjectProgressCard } from '../components/dashboard/SubjectProgressCard';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { userProgress, activeCourse, getAllSubjectsForCurrentSem } = useUser();
  const navigate = useNavigate();

  const currentSubjects = getAllSubjectsForCurrentSem();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, <span className="gradient-text">{userProgress.studentName}</span> 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
              {activeCourse.shortTitle}
            </span>
            <span>•</span>
            <span>Year {userProgress.selectedYear}, Semester {userProgress.selectedSemester}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all self-start md:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Switch Course / Semester</span>
        </button>
      </div>

      {/* Stats Overview Metric Cards */}
      <StatsOverview />

      {/* AI Insight Card */}
      <AIInsightCard />

      {/* Main Grid: Subject Cards & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Semester Subjects (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Semester {userProgress.selectedSemester} Subjects
              </h2>
              <p className="text-xs text-slate-400">Track module completion and continue syllabus reading</p>
            </div>
            <button
              onClick={() => navigate('/subjects')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSubjects.map(subject => (
                <SubjectProgressCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl glass-panel text-center space-y-3">
              <Layers className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No active subjects for this semester filter</h4>
              <button
                onClick={() => navigate('/subjects')}
                className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold"
              >
                Browse Full Subject Directory
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Tasks */}
        <div className="space-y-6">
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
};
