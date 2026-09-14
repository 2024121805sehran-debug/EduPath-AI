import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { COURSES_DATA } from '../data/coursesData';
import type { CourseId } from '../types';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Rocket
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboardingData } = useUser();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('btech-cse');
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 4>(2);
  const [selectedSem, setSelectedSem] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(3);

  // Helper for dynamic semester options depending on selected year
  const getSemestersForYear = (year: number) => {
    switch (year) {
      case 1:
        return [
          { num: 1, title: 'Semester 1', desc: 'Engineering Physics, Calculus, C Programming, Basics' },
          { num: 2, title: 'Semester 2', desc: 'Data Structures, Differential Equations, Engineering Graphics' }
        ];
      case 2:
        return [
          { num: 3, title: 'Semester 3', desc: 'DBMS, Operating Systems, Discrete Math, OOP in Java/C++' },
          { num: 4, title: 'Semester 4', desc: 'Computer Networks, Design & Analysis of Algorithms, Software Eng.' }
        ];
      case 3:
        return [
          { num: 5, title: 'Semester 5', desc: 'Machine Learning, Web Technologies, Compiler Design, Formal Automata' },
          { num: 6, title: 'Semester 6', desc: 'Deep Learning / NLP, Cloud Computing, Computer Graphics, Electives' }
        ];
      case 4:
        return [
          { num: 7, title: 'Semester 7', desc: 'Distributed Systems, MLOps, Information Security, Mini Project' },
          { num: 8, title: 'Semester 8', desc: 'Major Industrial Capstone Project, Industry Internships & Seminars' }
        ];
      default:
        return [];
    }
  };

  const selectedCourseObj = COURSES_DATA.find(c => c.id === selectedCourseId) || COURSES_DATA[0];

  const handleFinishOnboarding = () => {
    setOnboardingData(selectedCourseId, selectedYear, selectedSem);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0f19] text-white flex flex-col justify-center items-center px-4 py-12">
      {/* Container */}
      <div className="w-full max-w-4xl glass-panel border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Progress Step Indicator */}
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto border-b border-slate-800/80 pb-6">
          {[
            { s: 1, label: 'Course' },
            { s: 2, label: 'Year' },
            { s: 3, label: 'Semester' },
            { s: 4, label: 'Summary' }
          ].map(item => (
            <div key={item.s} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                  step === item.s
                    ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/50'
                    : step > item.s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {step > item.s ? <Check className="w-4 h-4" /> : item.s}
              </div>
              <span className={`hidden sm:inline text-xs font-semibold ${step === item.s ? 'text-white' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Select Course */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Step 1 of 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">What are you studying?</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Choose your degree specialization. All courses include data-driven syllabus modules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {COURSES_DATA.map(course => {
                const isSelected = selectedCourseId === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'gradient-bg-primary text-white shadow-md' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <DynamicIcon name={course.icon} className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white text-base">{course.title}</h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Degree Year */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Step 2 of 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Which year are you in?</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Select your current academic year in B.Tech {selectedCourseObj.shortTitle}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { year: 1 as const, label: '1st Year', desc: 'Freshman Foundations', semText: 'Sem 1 & Sem 2' },
                { year: 2 as const, label: '2nd Year', desc: 'Sophomore Core CS', semText: 'Sem 3 & Sem 4' },
                { year: 3 as const, label: '3rd Year', desc: 'Junior Specialization', semText: 'Sem 5 & Sem 6' },
                { year: 4 as const, label: '4th Year', desc: 'Senior Capstone', semText: 'Sem 7 & Sem 8' },
              ].map(item => {
                const isSelected = selectedYear === item.year;
                return (
                  <div
                    key={item.year}
                    onClick={() => {
                      setSelectedYear(item.year);
                      const sems = getSemestersForYear(item.year);
                      if (sems.length > 0) {
                        setSelectedSem(sems[0].num as any);
                      }
                    }}
                    className={`p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                      isSelected ? 'gradient-bg-primary text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">{item.label}</h4>
                      <p className="text-xs font-medium text-indigo-400 mb-2">{item.desc}</p>
                      <p className="text-[11px] text-slate-500">{item.semText}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Semester */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Step 3 of 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Select your semester</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Available semesters for Year {selectedYear} of {selectedCourseObj.shortTitle}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
              {getSemestersForYear(selectedYear).map(sem => {
                const isSelected = selectedSem === sem.num;
                return (
                  <div
                    key={sem.num}
                    onClick={() => setSelectedSem(sem.num as any)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg ${
                        isSelected ? 'gradient-bg-primary text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        S{sem.num}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{sem.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{sem.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Build Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Path Builder Summary & Confirmation */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 4 of 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Let's build your learning path</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                We have generated a personalized B.Tech learning dashboard tailored specifically to your selections.
              </p>
            </div>

            {/* Selection Summary Box */}
            <div className="p-6 rounded-2xl glass-card-accent border border-indigo-500/30 text-left space-y-4">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Configured Path Summary</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Selected Course</span>
                  <span className="text-sm font-bold text-white">{selectedCourseObj.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Degree Year</span>
                  <span className="text-sm font-bold text-indigo-400">Year {selectedYear}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-400">Target Semester</span>
                  <span className="text-sm font-bold text-cyan-400">Semester {selectedSem}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Selections</span>
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="px-8 py-3.5 rounded-xl gradient-bg-primary text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
