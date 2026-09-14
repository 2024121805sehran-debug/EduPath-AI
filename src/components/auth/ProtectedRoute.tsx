import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Sparkles } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, authLoading } = useUser();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/30 animate-bounce-subtle">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="text-xs text-indigo-300 font-bold">Verifying EduPath AI Session...</div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
