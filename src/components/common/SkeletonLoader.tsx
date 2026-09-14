import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'banner' | 'circle';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = ''
}) => {
  const items = Array.from({ length: count });

  if (type === 'circle') {
    return (
      <div className={`flex gap-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="w-12 h-12 rounded-full skeleton-shimmer shrink-0" />
        ))}
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className={`w-full h-44 rounded-3xl skeleton-shimmer ${className}`} />
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="h-4 w-full rounded-lg skeleton-shimmer" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl skeleton-shimmer shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
            </div>
          </div>
          <div className="h-16 w-full rounded-2xl skeleton-shimmer" />
          <div className="h-8 w-full rounded-xl skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};
