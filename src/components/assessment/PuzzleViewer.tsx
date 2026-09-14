import React, { useState, useEffect } from 'react';
import type { PuzzleData } from '../../types';
import { Layers, ArrowUpDown, CheckCircle2, RotateCcw } from 'lucide-react';

interface PuzzleViewerProps {
  puzzleData: PuzzleData;
  isSubmitted: boolean;
  onAnswerChange: (answer: any) => void;
}

export const PuzzleViewer: React.FC<PuzzleViewerProps> = ({
  puzzleData,
  isSubmitted,
  onAnswerChange
}) => {
  // Matching Puzzle State
  const [userPairs, setUserPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Ordering Puzzle State
  const [orderedList, setOrderedList] = useState<string[]>(
    puzzleData.shuffledItems || puzzleData.orderedSteps || []
  );

  useEffect(() => {
    if (puzzleData.puzzleType === 'matching') {
      onAnswerChange(userPairs);
    } else if (puzzleData.puzzleType === 'ordering') {
      onAnswerChange(orderedList);
    }
  }, [userPairs, orderedList]);

  // Handle Matching click
  const handleLeftClick = (left: string) => {
    if (isSubmitted) return;
    setSelectedLeft(left);
  };

  const handleRightClick = (right: string) => {
    if (isSubmitted || !selectedLeft) return;
    const newPairs = { ...userPairs, [selectedLeft]: right };
    setUserPairs(newPairs);
    setSelectedLeft(null);
    onAnswerChange(newPairs);
  };

  // Handle Ordering move
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const newList = [...orderedList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setOrderedList(newList);
    onAnswerChange(newList);
  };

  if (puzzleData.puzzleType === 'ordering') {
    return (
      <div className="space-y-4 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <ArrowUpDown className="w-4 h-4" />
          <span>Arrange the items/steps in the correct logical sequence:</span>
        </div>

        <div className="space-y-2">
          {orderedList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold flex items-center justify-center text-xs shrink-0">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveStep(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-slate-800 text-xs font-bold"
                  >
                    ▲
                  </button>
                  <button
                    disabled={idx === orderedList.length - 1}
                    onClick={() => moveStep(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-slate-800 text-xs font-bold"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Matching Puzzle
  return (
    <div className="space-y-4 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between text-xs font-bold text-indigo-400 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Match items on the Left to corresponding concepts on the Right</span>
        </div>
        {!isSubmitted && Object.keys(userPairs).length > 0 && (
          <button
            onClick={() => {
              setUserPairs({});
              setSelectedLeft(null);
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Pairs</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Item / Layer / Term</h4>
          {puzzleData.leftItems?.map((left, idx) => {
            const isSelected = selectedLeft === left;
            const pairedRight = userPairs[left];
            return (
              <div
                key={idx}
                onClick={() => handleLeftClick(left)}
                className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500'
                    : pairedRight
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{left}</span>
                {pairedRight ? (
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 truncate max-w-[120px]">
                    ➔ {pairedRight}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Select to Pair</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Definition / Match Target</h4>
          {puzzleData.rightItems?.map((right, idx) => {
            const isMatched = Object.values(userPairs).includes(right);
            return (
              <div
                key={idx}
                onClick={() => handleRightClick(right)}
                className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 opacity-90'
                    : selectedLeft
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200 animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{right}</span>
                {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
