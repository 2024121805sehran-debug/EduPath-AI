import type { Achievement } from '../types';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  courseAbbr: string;
  weeklyXp: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'First Step',
    description: 'Complete your first topic in any college course subject.',
    iconName: 'BookOpen',
    category: 'Mastery',
    totalRequired: 1,
    currentProgress: 1,
    unlocked: true,
    unlockedAt: '2026-09-10',
    xpReward: 50
  },
  {
    id: 'ach-first-quiz',
    title: 'First Quiz',
    description: 'Attempt and pass your first topic assessment quiz.',
    iconName: 'CheckCircle2',
    category: 'Quiz',
    totalRequired: 1,
    currentProgress: 1,
    unlocked: true,
    unlockedAt: '2026-09-11',
    xpReward: 30
  },
  {
    id: 'ach-quiz-master',
    title: 'Quiz Master',
    description: 'Score a perfect 100% accuracy on any module assessment.',
    iconName: 'Target',
    category: 'Quiz',
    totalRequired: 1,
    currentProgress: 1,
    unlocked: true,
    unlockedAt: '2026-09-12',
    xpReward: 50
  },
  {
    id: 'ach-coding-beginner',
    title: 'Coding Beginner',
    description: 'Solve your first programming challenge with all test cases passing.',
    iconName: 'Code',
    category: 'Coding',
    totalRequired: 1,
    currentProgress: 1,
    unlocked: true,
    unlockedAt: '2026-09-13',
    xpReward: 75
  },
  {
    id: 'ach-coding-master',
    title: 'Coding Master',
    description: 'Solve 5 coding problems across arrays, searching, or algorithms.',
    iconName: 'Terminal',
    category: 'Coding',
    totalRequired: 5,
    currentProgress: 2,
    unlocked: false,
    xpReward: 150
  },
  {
    id: 'ach-streak-7',
    title: '7 Day Streak',
    description: 'Maintain an active daily study streak for 7 consecutive days.',
    iconName: 'Flame',
    category: 'Streak',
    totalRequired: 7,
    currentProgress: 5,
    unlocked: false,
    xpReward: 100
  },
  {
    id: 'ach-streak-30',
    title: '30 Day Streak',
    description: 'Demonstrate elite consistency by maintaining a 30-day study streak.',
    iconName: 'Zap',
    category: 'Streak',
    totalRequired: 30,
    currentProgress: 5,
    unlocked: false,
    xpReward: 300
  },
  {
    id: 'ach-subject-completed',
    title: 'Subject Completed',
    description: 'Complete 100% of all syllabus units and topics in a subject.',
    iconName: 'Award',
    category: 'Mastery',
    totalRequired: 1,
    currentProgress: 0,
    unlocked: false,
    xpReward: 500
  },
  {
    id: 'ach-sem-completed',
    title: 'Semester Completed',
    description: 'Complete all subjects and modules for an academic semester.',
    iconName: 'Trophy',
    category: 'Mastery',
    totalRequired: 1,
    currentProgress: 0,
    unlocked: false,
    xpReward: 750
  }
];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Sophia Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'B.Tech CSE (AI & ML)',
    weeklyXp: 2450,
    streakDays: 14
  },
  {
    rank: 2,
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'B.Tech IT',
    weeklyXp: 2100,
    streakDays: 9
  },
  {
    rank: 3,
    name: 'Aarav Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'B.Sc Radiology',
    weeklyXp: 1850,
    streakDays: 12
  },
  {
    rank: 4,
    name: 'Alex Mercer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'B.Tech CSE',
    weeklyXp: 1450,
    streakDays: 5,
    isCurrentUser: true
  },
  {
    rank: 5,
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'BBA',
    weeklyXp: 1320,
    streakDays: 4
  },
  {
    rank: 6,
    name: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'B.Sc MLT',
    weeklyXp: 1150,
    streakDays: 6
  },
  {
    rank: 7,
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    courseAbbr: 'BALLB Law',
    weeklyXp: 980,
    streakDays: 3
  }
];
