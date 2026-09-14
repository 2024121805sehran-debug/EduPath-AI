import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProgress, CourseId, Course, Subject, Topic } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserTopicProgress,
  fetchUserQuizAttempts,
  fetchUserCodingSubmissions,
  upsertTopicProgress,
  recordQuizAttemptInDB,
  recordCodingSubmissionInDB,
  logUserActivityInDB,
  fetchUserActivitiesFromDB,
  type DBUserActivity
} from '../services/dbService';
import { Sparkles, Trophy, Award, X } from 'lucide-react';

export interface GamificationToast {
  id: string;
  type: 'xp' | 'badge' | 'level';
  title: string;
  subtitle?: string;
  xpAmount?: number;
}

interface UserContextType {
  authUser: any | null;
  authLoading: boolean;
  userProgress: UserProgress;
  activeCourse: Course;
  availableCourses: Course[];
  toasts: GamificationToast[];
  recentActivities: DBUserActivity[];
  removeToast: (id: string) => void;
  setDemoAuthenticated: (email: string, name: string) => void;
  signOutUser: () => Promise<void>;
  setOnboardingData: (courseId: CourseId, year: 1 | 2 | 3 | 4, sem: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => void;
  markTopicCompleted: (topicId: string, topicTitle?: string) => void;
  recordQuizScore: (quizId: string, score: number, totalQuestions: number, _customXp?: number, topicId?: string) => void;
  recordProblemSolved: (problemId: string, problemTitle?: string) => void;
  completeSubject: (subjectId: string, subjectName?: string) => void;
  addXP: (amount: number, reason?: string) => void;
  updateAvatar: (newAvatarUrl: string) => void;
  resetProgress: () => void;
  getSubjectProgress: (subjectId: string) => number;
  getAllSubjectsForCurrentSem: () => Subject[];
}

const DEFAULT_PROGRESS: UserProgress = {
  studentName: 'Student',
  email: 'student@edupath.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  selectedCourseId: 'btech-cse-aiml',
  selectedYear: 3,
  selectedSemester: 5,
  isOnboarded: true,
  completedTopicIds: [],
  completedQuizScores: {},
  solvedProblemIds: [],
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  strongestSubject: 'Machine Learning & Neural Networks',
  needsFocusSubject: 'Database Management Systems & SQL'
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const STORAGE_KEY = 'edupath_ai_user_progress_v5';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<GamificationToast[]>([]);
  const [recentActivities, setRecentActivities] = useState<DBUserActivity[]>([]);

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse user progress', e); }
    }
    return DEFAULT_PROGRESS;
  });

  const addToast = (toast: Omit<GamificationToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev.slice(-2), newToast]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  // Supabase Auth Listener & Initial Profile Sync
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthUser({ id: 'demo-user-id', email: userProgress.email });
      setAuthLoading(false);
      return;
    }

    let channel: any;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        syncUserDataFromDB(session.user.id, session.user.email || '');

        // Setup Realtime Database Subscription for instant updates across devices/tabs
        channel = supabase
          .channel(`realtime_user_${session.user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` }, () => {
            syncUserDataFromDB(session.user.id, session.user.email || '');
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'user_topic_progress', filter: `user_id=eq.${session.user.id}` }, () => {
            syncUserDataFromDB(session.user.id, session.user.email || '');
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'user_quiz_attempts', filter: `user_id=eq.${session.user.id}` }, () => {
            syncUserDataFromDB(session.user.id, session.user.email || '');
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'coding_submissions', filter: `user_id=eq.${session.user.id}` }, () => {
            syncUserDataFromDB(session.user.id, session.user.email || '');
          })
          .subscribe();
      } else {
        setAuthUser(null);
        setAuthLoading(false);
      }
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        await syncUserDataFromDB(session.user.id, session.user.email || '');
      } else {
        setAuthUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Sync user profile & real persistent data from Supabase DB
  const syncUserDataFromDB = async (userId: string, emailStr: string) => {
    try {
      const profile = await fetchUserProfile(userId);
      const dbProgress = await fetchUserTopicProgress(userId);
      const dbQuizzes = await fetchUserQuizAttempts(userId);
      const dbCoding = await fetchUserCodingSubmissions(userId);
      const dbActivities = await fetchUserActivitiesFromDB(userId);

      setRecentActivities(dbActivities);

      if (profile) {
        const completedIds = dbProgress
          .filter(p => p.status === 'completed')
          .map(p => p.topic_id);

        const quizScoreMap: Record<string, { score: number; totalQuestions: number; passed: boolean; xpEarned: number }> = {};
        dbQuizzes.forEach(q => {
          if (q.quiz_id && q.passed) {
            quizScoreMap[q.quiz_id] = {
              score: q.score,
              totalQuestions: Math.round((q.score * 100) / (q.percentage || 100)) || q.score,
              passed: q.passed,
              xpEarned: q.percentage === 100 ? 80 : 30
            };
          }
        });

        const solvedProblemIds = Array.from(
          new Set(dbCoding.filter(c => c.status === 'accepted').map(c => c.problem_id))
        );

        const realXp = typeof profile.xp === 'number' ? profile.xp : 0;
        const realLevel = typeof profile.level === 'number' && profile.level > 0 ? profile.level : Math.floor(realXp / 400) + 1;
        const realStreak = typeof profile.streak === 'number' && profile.streak > 0 ? profile.streak : 1;

        setUserProgress(prev => ({
          ...prev,
          studentName: profile.full_name || prev.studentName || 'Student',
          email: profile.email || emailStr || prev.email,
          avatarUrl: profile.avatar_url || prev.avatarUrl,
          selectedCourseId: (profile.course_id as CourseId) || prev.selectedCourseId,
          selectedYear: (profile.year as any) || prev.selectedYear,
          selectedSemester: (profile.semester as any) || prev.selectedSemester,
          isOnboarded: profile.onboarding_completed,
          xp: realXp,
          level: realLevel,
          streakDays: realStreak,
          completedTopicIds: completedIds,
          completedQuizScores: quizScoreMap,
          solvedProblemIds: solvedProblemIds
        }));
      }
    } catch (err) {
      console.warn('Error syncing DB data:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const setDemoAuthenticated = (emailStr: string, nameStr: string) => {
    const demoUser = { id: 'demo-user-id', email: emailStr };
    setAuthUser(demoUser);
    setUserProgress(prev => ({
      ...prev,
      studentName: nameStr,
      email: emailStr,
      isOnboarded: true
    }));
    setAuthLoading(false);
  };

  const signOutUser = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setUserProgress(DEFAULT_PROGRESS);
  };

  const activeCourse = COURSES_DATA.find(c => c.id === userProgress.selectedCourseId) || COURSES_DATA[0];

  const setOnboardingData = (
    courseId: CourseId,
    year: 1 | 2 | 3 | 4,
    sem: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  ) => {
    setUserProgress(prev => {
      const updated = {
        ...prev,
        selectedCourseId: courseId,
        selectedYear: year,
        selectedSemester: sem,
        isOnboarded: true
      };

      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        updateUserProfile(authUser.id, {
          course_id: courseId,
          year,
          semester: sem,
          onboarding_completed: true
        });
        logUserActivityInDB(authUser.id, 'onboarding_updated', `Selected Course: ${courseId} Year ${year} Sem ${sem}`);
      }

      return updated;
    });
  };

  // Rule 1: Complete topic: +50 XP
  const markTopicCompleted = (topicId: string, topicTitle?: string) => {
    setUserProgress(prev => {
      if (prev.completedTopicIds.includes(topicId)) return prev;
      const newTopics = [...prev.completedTopicIds, topicId];
      const xpGain = 50;
      const newXp = prev.xp + xpGain;
      const oldLevel = prev.level;
      const newLevel = Math.floor(newXp / 400) + 1;

      addToast({
        type: 'xp',
        title: '+50 XP Earned!',
        subtitle: topicTitle ? `Completed: ${topicTitle}` : 'Topic Completed',
        xpAmount: 50
      });

      if (newLevel > oldLevel) {
        setTimeout(() => {
          addToast({
            type: 'level',
            title: `Level Up! Level ${newLevel}`,
            subtitle: 'Keep up the academic velocity!'
          });
        }, 500);
      }

      // DB Sync
      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        upsertTopicProgress(authUser.id, topicId, 'completed', 100, 25);
        updateUserProfile(authUser.id, { xp: newXp, level: newLevel });
        logUserActivityInDB(authUser.id, 'topic_completed', `Completed topic: ${topicTitle || topicId}`, { topicId, xpEarned: 50 });
      }

      return {
        ...prev,
        completedTopicIds: newTopics,
        xp: newXp,
        level: newLevel
      };
    });
  };

  // Rule 2: Pass quiz: +30 XP | Perfect quiz: +50 XP
  const recordQuizScore = (quizId: string, score: number, totalQuestions: number, _customXp?: number, topicId?: string) => {
    setUserProgress(prev => {
      const isPerfect = totalQuestions > 0 && score === totalQuestions;
      const passed = totalQuestions > 0 ? (score / totalQuestions) >= 0.70 : false;
      const existing = prev.completedQuizScores[quizId];
      if (existing && existing.passed) return prev;
      
      let xpGain = passed ? (isPerfect ? 80 : 30) : 10;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 400) + 1;
      
      let newTopics = prev.completedTopicIds;
      if (passed && topicId && !newTopics.includes(topicId)) {
        newTopics = [...newTopics, topicId];
      }

      if (passed) {
        addToast({
          type: 'xp',
          title: isPerfect ? `+${xpGain} XP Perfect Score!` : `+${xpGain} XP Quiz Passed!`,
          subtitle: isPerfect ? '100% Accuracy Bonus (+50 XP)' : 'Assessment Passed (+30 XP)',
          xpAmount: xpGain
        });
      }

      // DB Sync
      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        recordQuizAttemptInDB(authUser.id, quizId, score, totalQuestions, passed);
        updateUserProfile(authUser.id, { xp: newXp, level: newLevel });
        logUserActivityInDB(authUser.id, 'quiz_attempted', `Passed Quiz ${quizId} (${score}/${totalQuestions})`, { quizId, passed, score });
      }

      return {
        ...prev,
        completedTopicIds: newTopics,
        completedQuizScores: {
          ...prev.completedQuizScores,
          [quizId]: { score, totalQuestions, passed, xpEarned: xpGain }
        },
        xp: newXp,
        level: newLevel
      };
    });
  };

  // Rule 3: Solve coding problem: +75 XP
  const recordProblemSolved = (problemId: string, problemTitle?: string) => {
    setUserProgress(prev => {
      if (prev.solvedProblemIds.includes(problemId)) return prev;
      const newSolved = [...prev.solvedProblemIds, problemId];
      const xpGain = 75;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 400) + 1;

      addToast({
        type: 'xp',
        title: '+75 XP Problem Solved!',
        subtitle: problemTitle ? `Accepted: ${problemTitle}` : 'Coding Challenge Accepted',
        xpAmount: 75
      });

      // DB Sync
      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        recordCodingSubmissionInDB(authUser.id, problemId, '# Solution code', 'python', 'accepted', 100);
        updateUserProfile(authUser.id, { xp: newXp, level: newLevel });
        logUserActivityInDB(authUser.id, 'coding_submitted', `Solved Coding Challenge: ${problemTitle || problemId}`, { problemId, xpEarned: 75 });
      }

      return {
        ...prev,
        solvedProblemIds: newSolved,
        xp: newXp,
        level: newLevel
      };
    });
  };

  // Rule 4: Complete subject: +500 XP
  const completeSubject = (_subjectId: string, subjectName?: string) => {
    setUserProgress(prev => {
      const xpGain = 500;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 400) + 1;

      addToast({
        type: 'badge',
        title: '+500 XP Subject Mastered!',
        subtitle: subjectName ? `Completed 100% of ${subjectName}` : 'Subject Mastery Bonus',
        xpAmount: 500
      });

      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        updateUserProfile(authUser.id, { xp: newXp, level: newLevel });
        logUserActivityInDB(authUser.id, 'subject_completed', `Mastered Subject: ${subjectName || _subjectId}`, { xpEarned: 500 });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const addXP = (amount: number, reason?: string) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 400) + 1;

      addToast({
        type: 'xp',
        title: `+${amount} XP Awarded!`,
        subtitle: reason || 'Bonus XP',
        xpAmount: amount
      });

      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        updateUserProfile(authUser.id, { xp: newXp, level: newLevel });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setUserProgress(prev => {
      const updated = { ...prev, avatarUrl: newAvatarUrl };
      if (authUser && isSupabaseConfigured() && authUser.id !== 'demo-user-id') {
        updateUserProfile(authUser.id, { avatar_url: newAvatarUrl });
      }
      return updated;
    });
  };

  const resetProgress = () => {
    setUserProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getAllSubjectsForCurrentSem = (): Subject[] => {
    const yearObj = activeCourse.years.find(y => y.yearNumber === userProgress.selectedYear);
    if (!yearObj) return [];
    const semObj = yearObj.semesters.find(s => s.semNumber === userProgress.selectedSemester);
    return semObj ? semObj.subjects : [];
  };

  const getSubjectProgress = (subjectId: string): number => {
    let allTopics: Topic[] = [];
    activeCourse.years.forEach(y => {
      y.semesters.forEach(s => {
        s.subjects.forEach(sub => {
          if (sub.id === subjectId) {
            sub.units.forEach(u => {
              allTopics.push(...u.topics);
            });
          }
        });
      });
    });

    if (allTopics.length === 0) return 0;
    const completedCount = allTopics.filter(t => userProgress.completedTopicIds.includes(t.id)).length;
    return Math.round((completedCount / allTopics.length) * 100);
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        authLoading,
        userProgress,
        activeCourse,
        availableCourses: COURSES_DATA,
        toasts,
        recentActivities,
        removeToast,
        setDemoAuthenticated,
        signOutUser,
        setOnboardingData,
        markTopicCompleted,
        recordQuizScore,
        recordProblemSolved,
        completeSubject,
        addXP,
        updateAvatar,
        resetProgress,
        getSubjectProgress,
        getAllSubjectsForCurrentSem
      }}
    >
      {children}

      {/* Floating Gamification Toast Animations */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl bg-slate-950/95 border border-indigo-500/40 text-white shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-bounce-subtle max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                toast.type === 'level' 
                  ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                  : toast.type === 'badge'
                  ? 'bg-purple-600 shadow-lg shadow-purple-500/30'
                  : 'gradient-bg-primary shadow-lg shadow-indigo-500/30'
              }`}>
                {toast.type === 'level' && <Trophy className="w-5 h-5 text-white" />}
                {toast.type === 'badge' && <Award className="w-5 h-5 text-white" />}
                {toast.type === 'xp' && <Sparkles className="w-5 h-5 text-white animate-spin-slow" />}
              </div>

              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>{toast.title}</span>
                </h4>
                {toast.subtitle && (
                  <p className="text-[11px] text-slate-300">{toast.subtitle}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
