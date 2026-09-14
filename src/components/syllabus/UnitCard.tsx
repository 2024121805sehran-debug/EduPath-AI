import React from 'react';
import type { Unit } from '../../types';

interface UnitCardProps {
  unit: Unit;
  children: React.ReactNode;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, children }) => {
  return (
    <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            Unit {unit.unitNumber}
          </span>
          <h3 className="text-base font-bold text-white">{unit.title}</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">{unit.topics.length} Topics</span>
      </div>

      {unit.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{unit.description}</p>
      )}

      <div className="space-y-2 pt-2">
        {children}
      </div>
    </div>
  );
};
