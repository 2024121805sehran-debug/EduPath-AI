import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg gradient-bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-200">EduPath AI</span>
          <span className="text-slate-600">•</span>
          <span>B.Tech PBL EdTech Project</span>
        </div>
        <p className="flex items-center gap-1 text-slate-500">
          Built for CSE, AI & ML, Data Science, IT & Cyber Security Students
        </p>
        <p className="text-slate-500">
          © {new Date().getFullYear()} EduPath AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
