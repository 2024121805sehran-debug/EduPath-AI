import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  calculateStudentMetrics,
  evaluateAcademicRisk,
  generateAIInsights,
  generatePersonalizedRecommendations
} from '../services/recommendationEngine';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Flame,
  Code2,
  Target,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Zap,
  BookCheck
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, activeCourse } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'insights' | 'recommendations'>('overview');

  // Compute live analytics metrics
  const metrics = calculateStudentMetrics(userProgress, activeCourse);
  const riskStatus = evaluateAcademicRisk(metrics);
  const insights = generateAIInsights(metrics, userProgress.strongestSubject, userProgress.needsFocusSubject);
  const recommendations = generatePersonalizedRecommendations(metrics, activeCourse);

  // 1. Radar Chart Data: Subject Skill Mastery
  const radarData = metrics.subjectAnalyses.map(sub => ({
    subject: sub.code || sub.subjectName.split(' ')[0],
    fullName: sub.subjectName,
    score: sub.averageScorePercent,
    progress: sub.progressPercent,
    fullMark: 100
  }));

  // 2. Bar Chart Data: Weekly Velocity & Time Spent
  const weeklyData = [
    { day: 'Mon', hours: 3.5, problems: 2, quizzes: 1 },
    { day: 'Tue', hours: 4.2, problems: 4, quizzes: 2 },
    { day: 'Wed', hours: 2.8, problems: 1, quizzes: 0 },
    { day: 'Thu', hours: 5.0, problems: 5, quizzes: 3 },
    { day: 'Fri', hours: 4.5, problems: 3, quizzes: 1 },
    { day: 'Sat', hours: 6.0, problems: 6, quizzes: 2 },
    { day: 'Sun', hours: 3.0, problems: 2, quizzes: 1 },
  ];

  // 3. Line Chart Data: Quiz Accuracy % Trajectory
  const quizTrendData = [
    { test: 'Module 1', score: 68 },
    { test: 'Module 2', score: 75 },
    { test: 'Midterm Prep', score: 82 },
    { test: 'Unit 3 Quiz', score: 88 },
    { test: 'Latest Assessment', score: metrics.averageQuizScorePercent },
  ];

  // 4. Pie Chart Data: Topics Distribution
  const pieData = [
    { name: 'Completed Topics', value: metrics.completedTopicsCount, color: '#6366f1' },
    { name: 'In Progress', value: Math.max(1, Math.round(metrics.totalTopicsCount * 0.2)), color: '#06b6d4' },
    { name: 'Remaining Units', value: Math.max(1, metrics.totalTopicsCount - metrics.completedTopicsCount - Math.round(metrics.totalTopicsCount * 0.2)), color: '#334155' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Progress Analysis System
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time analytics for <span className="text-indigo-300 font-semibold">{activeCourse.name}</span> (Year {userProgress.selectedYear} • Sem {userProgress.selectedSemester})
          </p>
        </div>

        {/* Risk Status Indicator Badge */}
        <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 backdrop-blur-md shadow-xl ${riskStatus.badgeColor}`}>
          <span className="text-xl">{riskStatus.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider">Academic Status:</span>
              <span className="text-xs font-extrabold">{riskStatus.label}</span>
            </div>
            <p className="text-[11px] opacity-90">{riskStatus.reason}</p>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'gradient-bg-primary text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overall Performance</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'gradient-bg-primary text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Subject Analysis ({metrics.subjectAnalyses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'insights'
              ? 'gradient-bg-primary text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Insights ({insights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'gradient-bg-primary text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Recommendations ({recommendations.length})</span>
        </button>
      </div>

      {/* 1. OVERALL PERFORMANCE METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Overall Progress */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Overall Progress</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.overallProgressPercent}%</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.overallProgressPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{metrics.completedTopicsCount} of {metrics.totalTopicsCount} topics</span>
        </div>

        {/* Average Quiz Score */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Avg Quiz Score</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.averageQuizScorePercent}%</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.averageQuizScorePercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{metrics.quizzesPassedCount} passed ({metrics.failedQuizzesCount} retries)</span>
        </div>

        {/* Coding Accuracy */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Coding Accuracy</span>
            <Code2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.codingAccuracyPercent}%</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.codingAccuracyPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{metrics.solvedCodingProblemsCount} problems solved</span>
        </div>

        {/* Learning Streak */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Learning Streak</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.streakDays} Days</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (metrics.streakDays / 7) * 100)}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Active daily learner</span>
        </div>

        {/* Total Learning Time */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Learning Time</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.formattedLearningTime}</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: '70%' }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Total time logged</span>
        </div>
      </div>

      {/* 2. MAIN INSIGHTS & RECOMMENDATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Generated Insights */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-extrabold text-white">AI Learning Insights</h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Live Pattern Analysis
            </span>
          </div>

          <div className="space-y-3">
            {insights.map(ins => (
              <div
                key={ins.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ins.type === 'positive'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : ins.type === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-indigo-950/20 border-indigo-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {ins.type === 'positive' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {ins.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                    {ins.type === 'info' && <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />}
                    <h4 className="text-xs font-extrabold text-white">{ins.title}</h4>
                  </div>
                  {ins.metricImpact && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 border border-slate-800 rounded-md text-indigo-300 shrink-0">
                      {ins.metricImpact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ins.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Personalized Actionable Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-extrabold text-white">Personalized Recommendations</h2>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Rule-Based AI Engine
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.2 text-[9px] font-bold rounded uppercase border ${
                        rec.priority === 'High' 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                          : rec.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-500">{rec.subjectName}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {rec.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3 h-3" />
                    {rec.estimatedMinutes}m
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => navigate(rec.targetRoute)}
                    className="px-3 py-1.5 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-md"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SUBJECT-BY-SUBJECT DETAILED ANALYSIS */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white">Subject Mastery & Topic Analysis</h2>
            <p className="text-xs text-slate-400">Detailed breakdown of strong vs weak topics across all current subjects</p>
          </div>
          <span className="text-xs text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
            {metrics.subjectAnalyses.length} Subjects Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.subjectAnalyses.map(sub => (
            <div
              key={sub.subjectId}
              className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">{sub.code}</span>
                    <h3 className="text-sm font-extrabold text-white leading-snug">{sub.subjectName}</h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-black bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl">
                    {sub.averageScorePercent}% Avg
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Topic Progress</span>
                    <span>{sub.completedTopicsCount} / {sub.totalTopicsCount} ({sub.progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="gradient-bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Strong Topics */}
                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strong Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {sub.strongTopics.map((top, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[10px] font-semibold">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weak Topics */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Weak Topics / Needs Focus:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {sub.weakTopics.map((top, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[10px] font-semibold">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/subjects/${sub.subjectId}`)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/30 text-xs font-bold text-slate-300 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Explore Subject Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VISUALIZATION CHARTS GRID (RECHARTS) */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-white">Visual Performance Analytics</h2>
          <p className="text-xs text-slate-400">Recharts interactive visualizations across skill radar, velocity, quiz trajectory, and topic completion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Subject Skill Radar Profile */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Subject Skill Radar Profile</span>
              </h3>
              <p className="text-xs text-slate-400">Relative assessment mastery across curriculum subjects</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Subject Mastery %" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Weekly Velocity & Study Time */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Weekly Velocity & Learning Hours</span>
              </h3>
              <p className="text-xs text-slate-400">Daily study hours logged on EduPath AI platform</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Study Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Quiz Score & Accuracy Trajectory */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Quiz Accuracy Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Percentage accuracy improvement across sequential tests</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizTrendData}>
                  <XAxis dataKey="test" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: '#8b5cf6' }} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Topics Distribution Ratio */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-emerald-400" />
                <span>Topic Completion Distribution</span>
              </h3>
              <p className="text-xs text-slate-400">Ratio of completed vs in-progress vs remaining curriculum topics</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
