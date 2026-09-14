import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Sparkles, Flame, Award, BookOpen, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { authUser, userProgress, activeCourse } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isOnboardingPage = location.pathname === '/onboarding';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={userProgress.isOnboarded ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                EduPath<span className="gradient-text font-extrabold ml-0.5">AI</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                B.Tech Edition
              </span>
            </div>
          </div>
        </Link>

        {/* Center Course Pill (If Onboarded and not on Landing/Onboarding) */}
        {!isLandingPage && !isOnboardingPage && userProgress.isOnboarded && (
          <div 
            onClick={() => navigate('/onboarding')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group text-xs text-slate-300"
            title="Click to switch Course or Semester"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-white">{activeCourse.shortTitle}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Yr {userProgress.selectedYear} / Sem {userProgress.selectedSemester}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>
        )}

        {/* Right Navigation & Gamification Stats */}
        <div className="flex items-center gap-3">
          {authUser || userProgress.isOnboarded ? (
            <>
              {/* Streak Badge */}
              <div 
                onClick={() => navigate('/achievements')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs cursor-pointer hover:bg-amber-500/20 transition-all"
                title="Learning Streak"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
                <span>{userProgress.streakDays} Days</span>
              </div>

              {/* XP Badge */}
              <div 
                onClick={() => navigate('/achievements')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-xs cursor-pointer hover:bg-indigo-500/20 transition-all"
                title="Total Experience Points"
              >
                <Award className="w-4 h-4 text-indigo-400" />
                <span>{userProgress.xp} XP</span>
                <span className="px-1.5 py-0.2 bg-indigo-600/40 text-[10px] rounded text-indigo-200">Lvl {userProgress.level}</span>
              </div>

              {/* Profile Avatar */}
              <Link 
                to="/profile" 
                className="flex items-center gap-2 p-1 rounded-full border border-slate-800 hover:border-indigo-500/60 transition-all group"
              >
                <img 
                  src={userProgress.avatarUrl} 
                  alt={userProgress.studentName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              </Link>
            </>
          ) : isLandingPage ? (
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/onboarding"
                className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all"
              >
                Explore Courses
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
