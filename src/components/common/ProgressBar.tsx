import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  heightClass?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = 'gradient-bg-primary',
  heightClass = 'h-2.5',
  showLabel = false
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400 font-medium">
          <span>Progress</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClass} border border-slate-700/50 p-0.5`}>
        <div
          className={`${heightClass} rounded-full ${colorClass} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
