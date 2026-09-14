export type CourseId = 
  | 'btech-cse'
  | 'btech-cse-aiml'
  | 'btech-cse-ds'
  | 'btech-it'
  | 'btech-cybersecurity'
  | 'bsc-radiology'
  | 'bsc-mlt'
  | 'bba'
  | 'ballb-law'
  | 'bdes-design';

export type DegreeStream = 
  | 'Engineering & Tech'
  | 'Medical & Health Sciences'
  | 'Business & Management'
  | 'Legal Studies'
  | 'Design & Creative Arts';

export interface Course {
  id: CourseId;
  name: string;
  abbreviation: string;
  // Aliases for layout compatibility
  title?: string;
  shortTitle?: string;
  stream: DegreeStream;
  description: string;
  badge: string;
  icon: string;
  accentColor: string;
  totalCredits: number;
  totalSemesters: number;
  popularJobs: string[];
  years: Year[];
}

export interface Year {
  id: string;
  yearNumber: 1 | 2 | 3 | 4 | 5;
  title?: string;
  description?: string;
  semesters: Semester[];
}

export interface Semester {
  id: string;
  semesterNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  // Alias for semester selection
  semNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  title?: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  courseId: CourseId;
  yearId: number;
  semesterId: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  category: string;
  iconName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor?: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description?: string;
  topics: Topic[];
}

export interface Resource {
  id: string;
  title: string;
  source: string;
  url: string;
  type: 'YouTube' | 'Article' | 'Documentation' | 'Notes' | 'Reference' | 'PDF';
}

export interface Topic {
  id: string;
  unitId: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  isCompleted?: boolean;
  hasQuiz?: boolean;
  quizId?: string;
  aiExplanation?: string;
  contentMarkdown?: string;
  learningObjectives: string[];
  keyTakeaways?: string[];
  resources: Resource[];
  codeSnippets?: {
    language: string;
    title: string;
    code: string;
    explanation: string;
  }[];
}

export type QuestionType = 'mcq' | 'puzzle' | 'true_false' | 'scenario' | 'coding';

export interface PuzzleData {
  puzzleType: 'matching' | 'ordering' | 'sql_fill' | 'logic_predict';
  leftItems?: string[];
  rightItems?: string[];
  orderedSteps?: string[];
  shuffledItems?: string[];
  correctPairs?: Record<string, string>;
  initialSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: number | string | string[] | Record<string, string>;
  explanation: string;
  categoryTag?: string;
  scenarioDetails?: {
    context: string;
    role: string;
    challenge: string;
  };
  puzzleData?: PuzzleData;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId?: string;
  topicTitle?: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passingScore: number; // Percentage, e.g. 70
  durationMinutes: number;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  scorePercent: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  strongTopics: string[];
  weakTopics: string[];
  completedAt: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  xpReward: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  initialCode: {
    python: string;
    cpp: string;
    java: string;
    javascript: string;
  };
  solutionHint: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'Streak' | 'Quiz' | 'Coding' | 'Mastery';
  totalRequired: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  suggestedTopics?: string[];
}

export interface UserProgress {
  studentName: string;
  email: string;
  avatarUrl: string;
  selectedCourseId: CourseId;
  selectedYear: 1 | 2 | 3 | 4 | 5;
  selectedSemester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  isOnboarded: boolean;
  completedTopicIds: string[];
  completedQuizScores: Record<string, { score: number; totalQuestions: number; passed: boolean; xpEarned: number }>;
  solvedProblemIds: string[];
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  strongestSubject: string;
  needsFocusSubject: string;
}
