import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  BookOpen
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDemoAuthenticated } = useUser();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Safe Demo Fallback Mode when Supabase environment variables are not populated yet
        setDemoAuthenticated(email || 'alex.mercer@btech.edu', fullName || 'Alex Mercer');
        setIsLoading(false);
        navigate(redirectPath);
        return;
      }

      if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Account created successfully! Directing to course selection...');
          setTimeout(() => navigate('/onboarding'), 600);
        } else {
          setSuccessMsg('Verification email sent! Please check your inbox or sign in.');
          setMode('login');
        }
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Login successful! Directing to course selection...');
          setTimeout(() => navigate('/onboarding'), 600);
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`
        });

        if (error) throw error;
        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication request failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassDemo = () => {
    setDemoAuthenticated('alex.mercer@btech.edu', 'Alex Mercer');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl gradient-bg-primary flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/25">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-white">
              EduPath<span className="gradient-text font-black ml-0.5">AI</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
              B.Tech Platform
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {mode === 'signup'
              ? 'Create your user account to begin AI course learning'
              : mode === 'forgot'
              ? 'Reset your EduPath account password'
              : 'Sign in to access your persistent course dashboard'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login' ? 'gradient-bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signup' ? 'gradient-bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@btech.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signup' ? 'Create EduPath Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Mode Banner (If Supabase keys unconfigured) */}
          {!isSupabaseConfigured() && (
            <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
              <p className="text-[11px] text-amber-300 font-semibold">
                💡 Supabase URL unconfigured in .env. Standard demo mode active.
              </p>
              <button
                type="button"
                onClick={handleBypassDemo}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs text-indigo-300 font-bold flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quick Launch Demo Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
