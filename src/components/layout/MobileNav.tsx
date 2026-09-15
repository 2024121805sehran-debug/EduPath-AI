import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Code, Bot, LineChart } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const checkChatOpen = () => {
      setIsChatOpen(document.body.classList.contains('ai-tutor-open'));
    };

    checkChatOpen();
    const observer = new MutationObserver(checkChatOpen);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Hide bottom navbar on AI Tutor route or when AI Tutor drawer is open
  if (location.pathname === '/ai-tutor' || isChatOpen) {
    return null;
  }

  const items = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Coding', path: '/coding', icon: Code },
    { label: 'AI Tutor', path: '/ai-tutor', icon: Bot },
    { label: 'Progress', path: '/progress', icon: LineChart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-2 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
