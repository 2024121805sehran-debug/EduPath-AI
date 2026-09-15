import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getQuickTopicExplanation } from '../services/aiService';
import { LearningObjectives } from '../components/syllabus/LearningObjectives';
import { ResourceCard } from '../components/syllabus/ResourceCard';
import type { Topic, Resource } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Code, 
  Check, 
  Clock, 
  X,
  Send,
  HelpCircle,
  BookOpen
} from 'lucide-react';

import { renderCleanFormattedText } from '../utils/textFormatter';

export const TopicDetailPage: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { activeCourse, userProgress, markTopicCompleted } = useUser();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Find subject and topic object
  let subjectObj: any = null;
  let topicObj: Topic | null = null;

  activeCourse.years.forEach(y => {
    y.semesters.forEach(s => {
      s.subjects.forEach(sub => {
        if (sub.id === subjectId) {
          subjectObj = sub;
          sub.units.forEach(u => {
            u.topics.forEach(t => {
              if (t.id === topicId) topicObj = t;
            });
          });
        }
      });
    });
  });

  if (!topicObj || !subjectObj) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
        <button
          onClick={() => navigate(`/subjects/${subjectId || ''}`)}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold"
        >
          Return to Subject Page
        </button>
      </div>
    );
  }

  const currentTopic: Topic = topicObj;
  const isCompleted = userProgress.completedTopicIds.includes(currentTopic.id);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const aiExplanationText = currentTopic.aiExplanation || getQuickTopicExplanation(currentTopic.title, subjectObj.name);

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/subjects/${subjectObj.id}`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {subjectObj.name}</span>
        </button>

        <button
          onClick={() => setAiModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl glass-card-accent border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ask AI to Explain</span>
        </button>
      </div>

      {/* Main Topic Workspace Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-800 space-y-8">
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
              Unit {currentTopic.unitNumber}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentTopic.estimatedMinutes} Mins Learning Time
            </span>
            <span className="px-2 py-0.2 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded">
              {currentTopic.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentTopic.title}
          </h1>

          {/* AI-Generated Style Explanation */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI EduBot Executive Summary</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {renderCleanFormattedText(aiExplanationText)}
            </div>
          </div>
        </div>

        {/* Learning Objectives Component */}
        {currentTopic.learningObjectives && currentTopic.learningObjectives.length > 0 && (
          <LearningObjectives objectives={currentTopic.learningObjectives} />
        )}

        {/* Content Body */}
        {currentTopic.contentMarkdown && (
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 font-sans">
              {renderCleanFormattedText(currentTopic.contentMarkdown)}
            </div>
          </div>
        )}

        {/* Code Snippets if present */}
        {currentTopic.codeSnippets && currentTopic.codeSnippets.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Executable Code & Case Study Snippets</span>
            </h3>

            {currentTopic.codeSnippets.map((snippet: any, sIdx: number) => (
              <div key={sIdx} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{snippet.title}</span>
                  <button
                    onClick={() => handleCopyCode(snippet.code, sIdx)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === sIdx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
                  {snippet.code}
                </pre>
                <div className="p-3 bg-slate-900/50 border-t border-slate-800/60 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Explanation: </span>
                  {snippet.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resource Section */}
        {currentTopic.resources && currentTopic.resources.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Topic Learning Resources</span>
                </h3>
                <p className="text-xs text-slate-400">Handpicked videos, articles, documentation, notes & references</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTopic.resources.map((res: Resource) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Topic Completed (+50 XP)</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Mark complete or pass assessment to earn +50 XP</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentTopic.hasQuiz && currentTopic.quizId && (
              <button
                onClick={() => navigate(`/quiz/${currentTopic.quizId}`)}
                className="px-4 py-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Pass Quiz Assessment</span>
              </button>
            )}

            <button
              onClick={() => markTopicCompleted(currentTopic.id, currentTopic.title)}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'gradient-bg-primary text-white shadow-lg shadow-indigo-500/25 hover:scale-105'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Marked as Complete' : 'Mark as Completed (+50 XP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Explanation Drawer Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel border border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">EduBot AI Explanation</h3>
                  <p className="text-[11px] text-slate-400">{currentTopic.title}</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800 max-h-[300px] overflow-y-auto">
              <div className="whitespace-pre-wrap font-sans">
                {aiExplanationText}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setAiModalOpen(false);
                  navigate('/ai-tutor');
                }}
                className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue Chat in AI Tutor</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
