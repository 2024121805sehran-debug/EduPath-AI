import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Trophy, 
  Bot, 
  User, 
  Sparkles,
  Code
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Coding Arena', path: '/coding', icon: Code },
    { label: 'Progress Analytics', path: '/progress', icon: LineChart },
    { label: 'Achievements', path: '/achievements', icon: Trophy },
    { label: 'AI Tutor', path: '/ai-tutor', icon: Bot, badge: 'AI' },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-slate-800/80 bg-slate-950/40 p-4 space-y-6 sticky top-16">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </p>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold gradient-bg-primary text-white rounded-md shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* AI Assistant Banner Box */}
      <div className="mt-auto p-4 rounded-2xl glass-card-accent border border-indigo-500/30 text-center relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-xs font-bold text-white mb-1">EduBot AI Assistant</h4>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Ask questions, debug code, or request exam topic summaries anytime.
        </p>
        <NavLink
          to="/ai-tutor"
          className="inline-block w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-colors"
        >
          Ask EduBot Now
        </NavLink>
      </div>
    </aside>
  );
};
