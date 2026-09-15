import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { AITutorPanel } from './AITutorPanel';

export const FloatingAITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('ai-tutor-open');
    } else {
      document.body.classList.remove('ai-tutor-open');
    }
    return () => {
      document.body.classList.remove('ai-tutor-open');
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 animate-bounce-subtle">
          <div className="relative group">
            {/* Tooltip */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask EduPath AI</span>
            </div>

            {/* Glowing Ring */}
            <div className="absolute -inset-1 rounded-full gradient-bg-primary blur-md opacity-75 group-hover:opacity-100 transition-all animate-pulse" />

            {/* Circular Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-full gradient-bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform border border-white/20"
              aria-label="Ask EduPath AI Tutor"
            >
              <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Panel Modal / Drawer */}
      {isOpen && <AITutorPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};
