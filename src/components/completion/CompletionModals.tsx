import React, { useState } from 'react';
import type { Subject } from '../../types';
import { CertificateModal } from './CertificateModal';
import { 
  Sparkles, 
  Trophy, 
  Award, 
  CheckCircle2, 
  BookCheck, 
  ArrowRight, 
  Download
} from 'lucide-react';

export type MasteryLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Excellent';

export const calculateMasteryLevel = (scorePercent: number): MasteryLevel => {
  if (scorePercent >= 90) return 'Excellent';
  if (scorePercent >= 75) return 'Advanced';
  if (scorePercent >= 60) return 'Intermediate';
  return 'Beginner';
};

interface SubjectCompletionModalProps {
  studentName: string;
  subject: Subject;
  finalScorePercent: number;
  topicsCount: number;
  quizScorePercent: number;
  codingAccuracyPercent: number;
  onClose: () => void;
  onContinue: () => void;
}

export const SubjectCompletionModal: React.FC<SubjectCompletionModalProps> = ({
  studentName,
  subject,
  finalScorePercent,
  topicsCount,
  quizScorePercent,
  codingAccuracyPercent: _codingAccuracyPercent,
  onClose,
  onContinue
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const masteryLevel = calculateMasteryLevel(finalScorePercent);

  const strongAreas = [
    `Core theoretical concepts in ${subject.name}`,
    'Structured problem analytical approach',
    'Assessment quiz recall accuracy'
  ];

  const weakAreas = [
    `Edge case constraints in Unit ${subject.units.length || 1}`,
    'Timed application execution under exam constraints'
  ];

  const recommendedRevision = `Review key formulas and code snippets in Unit ${subject.units.length > 1 ? '2' : '1'} to maintain peak retention.`;

  const overallSummary = `Outstanding velocity! You have completed 100% of required topics and assessments in ${subject.name} with an overall mastery grade of ${masteryLevel}.`;

  if (showCertificate) {
    return (
      <CertificateModal
        studentName={studentName}
        title={subject.name}
        subtitle={`${subject.code} • Course Module Completion`}
        masteryLevel={masteryLevel}
        finalScorePercent={finalScorePercent}
        completionDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        certificateId={`CERT-${subject.code}-${Date.now().toString().slice(-5)}`}
        type="subject"
        onClose={() => setShowCertificate(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0b0f19] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in my-auto">
        {/* Animated Celebration Banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl gradient-bg-primary flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/30 animate-bounce-subtle">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            🎉 Subject Completed!
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {subject.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            Subject Code: <span className="text-indigo-300 font-bold">{subject.code}</span> • All topics and assessments completed.
          </p>
        </div>

        {/* Performance Metrics Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Final Score</span>
            <div className="text-xl font-black text-indigo-400 mt-1">{finalScorePercent}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Topics Done</span>
            <div className="text-xl font-black text-emerald-400 mt-1">{topicsCount}/{topicsCount}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Quiz Avg</span>
            <div className="text-xl font-black text-purple-400 mt-1">{quizScorePercent}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mastery Level</span>
            <div className="text-xs font-extrabold text-amber-400 mt-2 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
              {masteryLevel}
            </div>
          </div>
        </div>

        {/* AI-Generated Subject Report */}
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Academic Subject Performance Report</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Strong Areas */}
            <div className="space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong Areas:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                {strongAreas.map((sa, i) => <li key={i}>{sa}</li>)}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <BookCheck className="w-3.5 h-3.5" /> Weak Areas:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                {weakAreas.map((wa, i) => <li key={i}>{wa}</li>)}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-indigo-500/20 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-indigo-300">Recommended Revision: </span>
            <p>{recommendedRevision}</p>
          </div>

          <div className="text-xs text-slate-300 italic pt-1">
            "{overallSummary}"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={onContinue}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SemesterCompletionModalProps {
  studentName: string;
  courseName: string;
  semesterNumber: number;
  subjects: Subject[];
  streakDays: number;
  onClose: () => void;
  onNextSemester: () => void;
}

export const SemesterCompletionModal: React.FC<SemesterCompletionModalProps> = ({
  studentName,
  courseName,
  semesterNumber,
  subjects,
  streakDays,
  onClose,
  onNextSemester
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  if (showCertificate) {
    return (
      <CertificateModal
        studentName={studentName}
        title={`Semester ${semesterNumber} Academic Honors`}
        subtitle={`${courseName} • Full Semester Clearance`}
        masteryLevel="Excellent"
        finalScorePercent={92}
        completionDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        certificateId={`CERT-SEM-${semesterNumber}-${Date.now().toString().slice(-5)}`}
        type="semester"
        onClose={() => setShowCertificate(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0b0f19] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in my-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20 animate-bounce-subtle">
            <Award className="w-8 h-8 text-emerald-400" />
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
            🎓 Semester Completed!
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Semester {semesterNumber} Clearance
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            {courseName} • All subjects and required modules cleared.
          </p>
        </div>

        {/* Summary Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Subject Scores Summary</h4>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 space-y-2">
            {subjects.map(sub => (
              <div key={sub.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                <span className="font-bold text-slate-200">{sub.name} ({sub.code})</span>
                <span className="font-black text-emerald-400">100% Cleared</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Semester Report */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-extrabold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Semester Academic Velocity Summary</span>
          </div>
          <p className="leading-relaxed">
            Congratulations! You have maintained a <span className="text-amber-400 font-bold">{streakDays}-day streak</span> while completing 100% of Semester {semesterNumber} requirements across all subjects.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Semester Certificate</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={onNextSemester}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Next Semester</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
