import React from 'react';
import { X, Printer, ShieldCheck, Award, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  title: string;
  subtitle: string;
  masteryLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Excellent';
  finalScorePercent: number;
  completionDate: string;
  certificateId: string;
  type: 'subject' | 'semester' | 'course';
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  title,
  subtitle,
  masteryLevel,
  finalScorePercent,
  completionDate,
  certificateId,
  type,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'text-amber-600 border-amber-500 bg-amber-50';
      case 'Advanced': return 'text-indigo-600 border-indigo-500 bg-indigo-50';
      case 'Intermediate': return 'text-emerald-600 border-emerald-500 bg-emerald-50';
      default: return 'text-blue-600 border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in my-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Official EduPath AI {type.toUpperCase()} Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CONTAINER */}
        <div 
          id="printable-certificate"
          className="bg-[#faf8f5] text-slate-900 border-[12px] border-double border-[#1e293b] p-8 sm:p-12 rounded-2xl relative shadow-2xl space-y-8 font-serif"
        >
          {/* Certificate Header Stamp */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-indigo-900 font-sans font-black tracking-widest text-xs uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>EduPath AI Higher Education Platform</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif uppercase">
              Certificate of Mastery
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-sans tracking-wide italic">
              This official document certifies academic excellence and verified skill proficiency.
            </p>
          </div>

          {/* Recipient */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-xs uppercase font-sans font-bold tracking-widest text-slate-500">
              PROUDLY PRESENTED TO
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-indigo-950 tracking-tight font-sans border-b-2 border-indigo-900/20 pb-2 inline-block px-8">
              {studentName}
            </h2>
          </div>

          {/* Award Description */}
          <div className="text-center space-y-3 max-w-xl mx-auto font-sans">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              for successfully completing all curriculum units, topic assessments, practical coding challenges, and syllabus requirements in:
            </p>

            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {title}
            </h3>

            <p className="text-xs text-slate-600 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Mastery Level & Score Pill */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-sans">
            <div className={`px-4 py-2 rounded-xl border-2 font-bold text-xs flex items-center gap-2 ${getMasteryColor(masteryLevel)}`}>
              <span>Mastery Grade: {masteryLevel}</span>
            </div>

            <div className="px-4 py-2 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold text-xs">
              Aggregate Performance: {finalScorePercent}%
            </div>
          </div>

          {/* Certificate Footer Signatures */}
          <div className="pt-8 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans text-xs">
            <div className="text-left space-y-1">
              <div className="font-bold text-slate-900">EduPath AI Academic Directorate</div>
              <div className="text-[11px] text-slate-500">Issued Date: {completionDate}</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: {certificateId}</div>
            </div>

            {/* Seal Graphic */}
            <div className="w-16 h-16 rounded-full border-4 border-amber-600 bg-amber-500/10 flex items-center justify-center text-amber-700 font-black text-[10px] uppercase text-center p-1 shadow-md">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic text-base text-indigo-950 font-bold border-b border-slate-400 pb-0.5">
                EduPath AI Board
              </div>
              <div className="text-[11px] text-slate-600 font-bold">Authorized Digital Signature</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
