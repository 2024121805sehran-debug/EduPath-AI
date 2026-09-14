import type { UserProgress, Course, Subject, Topic } from '../types';

export type RiskLevel = 'on_track' | 'needs_attention' | 'at_risk';

export interface AcademicRiskStatus {
  level: RiskLevel;
  label: string;
  badgeColor: string;
  dotColor: string;
  icon: string;
  reason: string;
  factors: string[];
}

export interface SubjectAnalysis {
  subjectId: string;
  subjectName: string;
  code: string;
  category: string;
  progressPercent: number;
  averageScorePercent: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  strongTopics: string[];
  weakTopics: string[];
}

export interface StudentAnalyticsMetrics {
  totalTopicsCount: number;
  completedTopicsCount: number;
  overallProgressPercent: number;
  averageQuizScorePercent: number;
  quizzesAttemptedCount: number;
  quizzesPassedCount: number;
  failedQuizzesCount: number;
  solvedCodingProblemsCount: number;
  totalCodingAttemptsCount: number;
  codingAccuracyPercent: number;
  totalLearningTimeMinutes: number;
  formattedLearningTime: string;
  streakDays: number;
  subjectAnalyses: SubjectAnalysis[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  category: 'Subject' | 'Coding' | 'Assessment' | 'Streak';
  metricImpact?: string;
}

export interface RecommendationAction {
  id: string;
  type: 'revise_topic' | 'take_quiz' | 'solve_coding' | 'read_resource' | 'next_topic';
  title: string;
  description: string;
  subjectName: string;
  targetId?: string;
  targetRoute: string;
  actionText: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
}

/**
 * Aggregates student metrics from user progress state and active course data.
 */
export const calculateStudentMetrics = (
  userProgress: UserProgress,
  activeCourse: Course
): StudentAnalyticsMetrics => {
  const currentSemSubjects: Subject[] = [];
  activeCourse.years.forEach(y => {
    if (y.yearNumber === userProgress.selectedYear) {
      y.semesters.forEach(s => {
        if (s.semNumber === userProgress.selectedSemester) {
          currentSemSubjects.push(...s.subjects);
        }
      });
    }
  });

  // Fallback to all subjects if semester subjects empty
  const subjectsToAnalyze = currentSemSubjects.length > 0 ? currentSemSubjects : (activeCourse.years[0]?.semesters[0]?.subjects || []);

  let totalTopics = 0;
  let totalCompletedTopics = 0;
  const subjectAnalyses: SubjectAnalysis[] = [];

  subjectsToAnalyze.forEach(subject => {
    const subTopics: Topic[] = [];
    subject.units.forEach(u => subTopics.push(...u.topics));

    totalTopics += subTopics.length;
    const completedInSub = subTopics.filter(t => userProgress.completedTopicIds.includes(t.id));
    totalCompletedTopics += completedInSub.length;

    const progressPct = subTopics.length > 0 ? Math.round((completedInSub.length / subTopics.length) * 100) : 0;

    // Calculate quiz scores for this subject if available
    let subQuizScores: number[] = [];
    Object.entries(userProgress.completedQuizScores).forEach(([quizId, data]) => {
      if (quizId.includes(subject.id) || quizId.includes(subject.name.toLowerCase().slice(0, 4))) {
        subQuizScores.push(Math.round((data.score / Math.max(1, data.totalQuestions)) * 100));
      }
    });

    const avgSubScore = subQuizScores.length > 0 
      ? Math.round(subQuizScores.reduce((a, b) => a + b, 0) / subQuizScores.length)
      : Math.min(100, Math.max(60, progressPct + 15));

    const strongTopics = completedInSub.slice(0, 3).map(t => t.title);
    const uncompleted = subTopics.filter(t => !userProgress.completedTopicIds.includes(t.id));
    const weakTopics = uncompleted.slice(0, 2).map(t => t.title);

    if (strongTopics.length === 0 && subTopics.length > 0) {
      strongTopics.push(subTopics[0].title);
    }
    if (weakTopics.length === 0 && uncompleted.length > 0) {
      weakTopics.push(uncompleted[0].title);
    } else if (weakTopics.length === 0 && subTopics.length > 1) {
      weakTopics.push(subTopics[subTopics.length - 1].title);
    }

    subjectAnalyses.push({
      subjectId: subject.id,
      subjectName: subject.name,
      code: subject.code,
      category: subject.category,
      progressPercent: progressPct,
      averageScorePercent: avgSubScore,
      completedTopicsCount: completedInSub.length,
      totalTopicsCount: subTopics.length,
      strongTopics,
      weakTopics
    });
  });

  const overallProgressPercent = totalTopics > 0 ? Math.round((totalCompletedTopics / totalTopics) * 100) : 0;

  // Calculate Quiz metrics
  const quizScoresArray = Object.values(userProgress.completedQuizScores);
  const quizzesAttemptedCount = quizScoresArray.length;
  const quizzesPassedCount = quizScoresArray.filter(q => q.passed).length;
  const failedQuizzesCount = quizzesAttemptedCount - quizzesPassedCount;

  const averageQuizScorePercent = quizzesAttemptedCount > 0
    ? Math.round(
        (quizScoresArray.reduce((acc, q) => acc + (q.score / Math.max(1, q.totalQuestions)), 0) / quizzesAttemptedCount) * 100
      )
    : 82; // Baseline default for demo profile

  // Calculate Coding Accuracy
  const solvedCodingProblemsCount = userProgress.solvedProblemIds.length;
  const totalCodingAttemptsCount = Math.max(solvedCodingProblemsCount, solvedCodingProblemsCount + 2); // Simulated attempts
  const codingAccuracyPercent = totalCodingAttemptsCount > 0
    ? Math.round((solvedCodingProblemsCount / totalCodingAttemptsCount) * 100)
    : 85;

  // Calculate Learning Time (based on completed topics + solved problems)
  const totalLearningTimeMinutes = (totalCompletedTopics * 25) + (solvedCodingProblemsCount * 30) + (quizzesAttemptedCount * 15) + 120;
  const hours = Math.floor(totalLearningTimeMinutes / 60);
  const mins = totalLearningTimeMinutes % 60;
  const formattedLearningTime = `${hours}h ${mins}m`;

  return {
    totalTopicsCount: totalTopics,
    completedTopicsCount: totalCompletedTopics,
    overallProgressPercent,
    averageQuizScorePercent,
    quizzesAttemptedCount,
    quizzesPassedCount,
    failedQuizzesCount,
    solvedCodingProblemsCount,
    totalCodingAttemptsCount,
    codingAccuracyPercent,
    totalLearningTimeMinutes,
    formattedLearningTime,
    streakDays: userProgress.streakDays,
    subjectAnalyses
  };
};

/**
 * Academic Risk Indicator Evaluator (Rules-based engine extensible to ML classifier)
 * Evaluates academic velocity based strictly on syllabus progress, test scores, failures, and streak.
 */
export const evaluateAcademicRisk = (metrics: StudentAnalyticsMetrics): AcademicRiskStatus => {
  const factors: string[] = [];

  if (metrics.overallProgressPercent < 35) {
    factors.push('Syllabus completion is below 35% target.');
  }
  if (metrics.averageQuizScorePercent < 65) {
    factors.push('Average assessment score is below passing threshold (65%).');
  }
  if (metrics.failedQuizzesCount >= 2) {
    factors.push(`Multiple unpassed quiz attempts (${metrics.failedQuizzesCount} quizzes require retry).`);
  }
  if (metrics.streakDays < 2) {
    factors.push('Recent learning activity is low (streak < 2 days).');
  }

  if (metrics.overallProgressPercent < 25 || metrics.averageQuizScorePercent < 55 || metrics.failedQuizzesCount >= 3) {
    return {
      level: 'at_risk',
      label: 'At Risk',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dotColor: 'bg-rose-500',
      icon: '🔴',
      reason: 'Low syllabus progress and assessment scores indicate high risk of falling behind schedule.',
      factors: factors.length > 0 ? factors : ['Curriculum velocity is behind recommended milestone targets.']
    };
  }

  if (metrics.overallProgressPercent < 55 || metrics.averageQuizScorePercent < 75 || metrics.failedQuizzesCount >= 1 || metrics.streakDays < 3) {
    return {
      level: 'needs_attention',
      label: 'Needs Attention',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dotColor: 'bg-amber-400',
      icon: '🟡',
      reason: 'Progress is steady but key topics and quiz retries require focus to maintain high mastery.',
      factors: factors.length > 0 ? factors : ['Some topics require revision to reach optimal mastery.']
    };
  }

  return {
    level: 'on_track',
    label: 'On Track',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    icon: '🟢',
    reason: 'Exceeding target milestones with strong quiz retention and active study consistency.',
    factors: ['Consistent study streak maintained.', 'High average assessment accuracy.', 'Syllabus completion pace on schedule.']
  };
};

/**
 * AI Insight Generator (Rule/Pattern-Based, expandable to Gemini API or Custom ML Model)
 */
export const generateAIInsights = (
  metrics: StudentAnalyticsMetrics,
  strongestSubjectName?: string,
  needsFocusSubjectName?: string
): AIInsight[] => {
  const insights: AIInsight[] = [];

  // Insight 1: Strongest Subject / Improvement
  const bestSub = metrics.subjectAnalyses.reduce((prev, current) => 
    (current.averageScorePercent > prev.averageScorePercent) ? current : prev
  , metrics.subjectAnalyses[0] || { subjectName: strongestSubjectName || 'Core Subjects', averageScorePercent: 85, weakTopics: [] });

  insights.push({
    id: 'ins-1',
    title: `Strong Performance in ${bestSub.subjectName}`,
    description: `Your comprehension in ${bestSub.subjectName} is improving with an average assessment score of ${bestSub.averageScorePercent}%. Keep leveraging your conceptual foundation here.`,
    type: 'positive',
    category: 'Subject',
    metricImpact: `+${bestSub.averageScorePercent}% Mastery`
  });

  // Insight 2: Weak Topic / Needs Focus
  const weakSub = metrics.subjectAnalyses.reduce((prev, current) => 
    (current.averageScorePercent < prev.averageScorePercent) ? current : prev
  , metrics.subjectAnalyses[metrics.subjectAnalyses.length - 1] || { subjectName: needsFocusSubjectName || 'Advanced Topics', weakTopics: ['Core Fundamentals'] });

  const weakTopicName = weakSub.weakTopics[0] || 'advanced problem sets';

  insights.push({
    id: 'ins-2',
    title: `Targeted Practice Recommended for ${weakTopicName}`,
    description: `You are currently experiencing lower accuracy in ${weakTopicName} within ${weakSub.subjectName}. Reviewing the core concepts and attempting a 5-question quick quiz will boost retention.`,
    type: 'warning',
    category: 'Subject',
    metricImpact: 'Needs Revision'
  });

  // Insight 3: Conceptual vs Coding Pattern
  if (metrics.codingAccuracyPercent >= 80) {
    insights.push({
      id: 'ins-3',
      title: 'Strong Algorithmic & Problem-Solving Proficiency',
      description: `Your coding accuracy is ${metrics.codingAccuracyPercent}% across solved algorithmic challenges. You perform consistently well when translating theory into functional code.`,
      type: 'positive',
      category: 'Coding',
      metricImpact: `${metrics.solvedCodingProblemsCount} Problems Solved`
    });
  } else {
    insights.push({
      id: 'ins-4',
      title: 'Higher Conceptual Mastery than Coding Execution',
      description: 'You perform better in conceptual MCQ assessments than in timed coding challenges. Practicing 15 minutes of hands-on coding daily will align code execution with your theoretical knowledge.',
      type: 'info',
      category: 'Coding',
      metricImpact: `${metrics.codingAccuracyPercent}% Accuracy`
    });
  }

  // Insight 4: Learning Consistency & Streak
  if (metrics.streakDays >= 5) {
    insights.push({
      id: 'ins-5',
      title: 'Excellent Consistency Streak',
      description: `You have maintained an active study streak of ${metrics.streakDays} consecutive days. Consistent daily learning significantly improves long-term memory retention.`,
      type: 'positive',
      category: 'Streak',
      metricImpact: `${metrics.streakDays} Day Streak`
    });
  }

  return insights;
};

/**
 * Recommendation Engine: Actionable personalized recommendations (5 Core Types)
 * 1. Revise weak topic
 * 2. Take a quiz
 * 3. Solve coding problem
 * 4. Read recommended resource
 * 5. Move to next topic
 */
export const generatePersonalizedRecommendations = (
  metrics: StudentAnalyticsMetrics,
  activeCourse?: Course
): RecommendationAction[] => {
  const recommendations: RecommendationAction[] = [];

  const lowestSub = metrics.subjectAnalyses.length > 0 
    ? [...metrics.subjectAnalyses].sort((a, b) => a.averageScorePercent - b.averageScorePercent)[0]
    : { subjectId: 'sub-1', subjectName: 'Core Specialization', weakTopics: ['Core Fundamentals'] };

  const highestSub = metrics.subjectAnalyses.length > 0
    ? [...metrics.subjectAnalyses].sort((a, b) => b.progressPercent - a.progressPercent)[0]
    : { subjectId: 'sub-2', subjectName: 'Primary Module', weakTopics: [] };

  const weakTopicTitle = lowestSub.weakTopics[0] || 'Core Subject Module';

  // Recommendation 1: Revise weak topic
  recommendations.push({
    id: 'rec-1',
    type: 'revise_topic',
    title: `Revise Weak Topic: ${weakTopicTitle}`,
    description: `Revisit ${weakTopicTitle} in ${lowestSub.subjectName} to reinforce key principles and step-by-step logic before upcoming assessments.`,
    subjectName: lowestSub.subjectName,
    targetRoute: `/subjects/${lowestSub.subjectId}`,
    actionText: 'Revise Topic',
    priority: 'High',
    estimatedMinutes: 15
  });

  // Recommendation 2: Take a quiz
  recommendations.push({
    id: 'rec-2',
    type: 'take_quiz',
    title: `Take Assessment Quiz: ${lowestSub.subjectName}`,
    description: `Test your knowledge with a 10-question MCQ & scenario quiz in ${lowestSub.subjectName} to convert weak areas into strong topics.`,
    subjectName: lowestSub.subjectName,
    targetRoute: `/subjects/${lowestSub.subjectId}`,
    actionText: 'Take Quiz',
    priority: 'High',
    estimatedMinutes: 10
  });

  // Recommendation 3: Solve coding problem OR Case Study depending on course type
  const isTechCourse = activeCourse ? (activeCourse.id.includes('cse') || activeCourse.id.includes('it') || activeCourse.id.includes('cyber')) : true;

  if (isTechCourse) {
    recommendations.push({
      id: 'rec-3',
      type: 'solve_coding',
      title: 'Solve Hands-On Coding Challenge',
      description: 'Implement a real-world algorithm solution (Arrays / Strings / Sorting) in C++, Python, or Java to boost practical coding accuracy.',
      subjectName: lowestSub.subjectName || 'Computer Science & Software',
      targetRoute: '/coding',
      actionText: 'Solve Problem',
      priority: 'Medium',
      estimatedMinutes: 20
    });
  } else {
    recommendations.push({
      id: 'rec-3',
      type: 'solve_coding',
      title: `Analyze Practical Case Study: ${lowestSub.subjectName}`,
      description: `Review clinical case studies, diagnostic procedures, and anatomical protocols in ${lowestSub.subjectName} to strengthen practical interpretation skills.`,
      subjectName: lowestSub.subjectName,
      targetRoute: `/subjects/${lowestSub.subjectId}`,
      actionText: 'Review Case Study',
      priority: 'Medium',
      estimatedMinutes: 20
    });
  }

  // Recommendation 4: Read recommended resource
  recommendations.push({
    id: 'rec-4',
    type: 'read_resource',
    title: `Read Recommended Reference: ${weakTopicTitle}`,
    description: 'Access curated video tutorials, reference notes, and official documentation attached to your active unit.',
    subjectName: lowestSub.subjectName,
    targetRoute: `/subjects/${lowestSub.subjectId}`,
    actionText: 'Read Resource',
    priority: 'Medium',
    estimatedMinutes: 12
  });

  // Recommendation 5: Move to next topic
  recommendations.push({
    id: 'rec-5',
    type: 'next_topic',
    title: `Advance to Next Unit in ${highestSub.subjectName}`,
    description: `You are on schedule in ${highestSub.subjectName}! Unlock the next module to stay ahead of your semester curriculum milestone.`,
    subjectName: highestSub.subjectName,
    targetRoute: `/subjects/${highestSub.subjectId}`,
    actionText: 'Next Topic',
    priority: 'Low',
    estimatedMinutes: 25
  });

  return recommendations;
};
