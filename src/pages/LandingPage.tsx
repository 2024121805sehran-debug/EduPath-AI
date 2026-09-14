import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES_DATA } from '../data/coursesData';
import type { DegreeStream } from '../types';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Bot, 
  HelpCircle, 
  Code2, 
  LineChart, 
  Lightbulb
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStream, setSelectedStream] = useState<DegreeStream | 'All'>('All');

  const streams: (DegreeStream | 'All')[] = [
    'All',
    'Engineering & Tech',
    'Medical & Health Sciences',
    'Business & Management',
    'Legal Studies',
    'Design & Creative Arts'
  ];

  const filteredCourses = COURSES_DATA.filter(course => 
    selectedStream === 'All' || course.stream === selectedStream
  );

  const featureCards = [
    {
      title: 'Personalized Learning',
      desc: 'Tailored study paths crafted specifically for Engineering, Medical, BBA, Law, and Design degree syllabi.',
      icon: Brain,
      gradient: 'from-indigo-500 to-cyan-500'
    },
    {
      title: 'AI Doubt Solver',
      desc: '24/7 intelligent AI tutor to explain medical anatomy, legal statutes, corporate accounting, engineering math, and code.',
      icon: Bot,
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Smart Quizzes',
      desc: 'Targeted assessments with instant feedback, explanations, and XP rewards to test module comprehension.',
      icon: HelpCircle,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Practical Workspaces',
      desc: 'Embedded code IDEs, medical case study simulators, and legal judgment analysis tools.',
      icon: Code2,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Progress Tracking',
      desc: 'Visual analytics with Recharts tracking subject mastery, weekly study velocity, and skill radar profiles.',
      icon: LineChart,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'AI Recommendations',
      desc: 'Proactive insights detecting weak topics and suggesting optimal daily revision priorities.',
      icon: Lightbulb,
      gradient: 'from-rose-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold mb-8 shadow-lg shadow-indigo-500/10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen AI Learning Platform for Engineering, Medical, BBA & Law</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Learn Smarter. Track Better.{' '}
            <span className="gradient-text block mt-2">Master Any Degree Course.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Your AI-powered personalized learning companion for college. Multi-disciplinary support across B.Tech, B.Sc Radiology, B.Sc MLT, BBA, BA LL.B Law, and B.Des Design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-bg-primary text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:scale-105 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#courses"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-indigo-500/50 text-slate-200 font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All Courses</span>
            </a>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">10 Specializations</div>
              <div className="text-xs text-slate-400 font-medium">Engineering, Medical, BBA & Law</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">5 Streams</div>
              <div className="text-xs text-slate-400 font-medium">Data-Driven Syllabus Model</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">24/7 AI Tutor</div>
              <div className="text-xs text-slate-400 font-medium">Instant Doubt Resolution</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100% Practical</div>
              <div className="text-xs text-slate-400 font-medium">Interactive Quizzes & Case Studies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Engineered for College Success
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Everything you need to master your degree curriculum, score higher in semester exams, and build real-world proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs font-semibold text-indigo-400 gap-1">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Explorer Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Explore Academic Disciplines & Courses
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Select your academic stream: Engineering, Medical Radiology & MLT, Business BBA, Legal Studies Law, or Product Design.
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {streams.map(stream => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedStream === stream
                    ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                onClick={() => navigate('/onboarding')}
                className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <DynamicIcon name={course.icon} className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                      {course.stream}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {course.popularJobs.slice(0, 3).map((job, jIdx) => (
                      <span key={jIdx} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 rounded">
                        {job}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 rounded-xl bg-slate-900 group-hover:gradient-bg-primary text-slate-300 group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2">
                    <span>Select & Explore Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl gradient-bg-primary text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Ready to Master Your Degree Course?
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Join thousands of students using EduPath AI to study smarter, resolve doubts, and excel across Engineering, Medical, BBA, Law, and Design degrees.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-8 py-4 rounded-2xl bg-white text-indigo-950 font-extrabold text-base shadow-lg hover:bg-slate-100 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
