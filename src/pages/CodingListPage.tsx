import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CODING_PROBLEMS_DATA } from '../data/codingData';
import { 
  Code2, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

export const CodingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress } = useUser();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Arrays',
    'Strings',
    'Searching',
    'Sorting',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Recursion',
    'Binary Search',
    'Trees'
  ];

  const filteredProblems = CODING_PROBLEMS_DATA.filter(prob => {
    const matchesCat = selectedCategory === 'All' || prob.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || prob.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) || prob.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  const solvedCount = userProgress.solvedProblemIds.length;
  const totalCount = CODING_PROBLEMS_DATA.length;
  const accuracyPercent = Math.round((solvedCount / (totalCount || 1)) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive IDE & Algorithm Practice</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Coding Practice Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Solve industry coding challenges in C++, Python, or Java. Master Arrays, Linked Lists, Stacks, Trees, and AI algorithms.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solved</span>
            <p className="text-2xl font-black text-emerald-400">{solvedCount} / {totalCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion</span>
            <p className="text-2xl font-black text-indigo-400">{accuracyPercent}%</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, array, string, tree, or algorithm..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Coding Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.map(prob => {
          const isSolved = userProgress.solvedProblemIds.includes(prob.id);
          return (
            <div
              key={prob.id}
              onClick={() => navigate(`/coding/${prob.id}`)}
              className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                      {prob.category}
                    </span>
                    <span
                      className={`px-2 py-0.2 text-[10px] font-bold border rounded ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>

                  {isSolved && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Solved
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {prob.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {prob.description.replace(/###|####|\*|`/g, '')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  +{prob.xpReward} XP
                </span>

                <span className="text-indigo-300 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Solve Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
