import React from 'react';
import type { Resource } from '../../types';
import { ExternalLink, Video, FileText, BookOpen, Link2, FileCode } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'YouTube':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'Article':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Documentation':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'Notes':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Reference':
      default:
        return <Link2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBadgeStyle = (type: Resource['type']) => {
    switch (type) {
      case 'YouTube':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'Article':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Documentation':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Notes':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    }
  };

  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-4 group">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {getResourceIcon(resource.type)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.2 text-[10px] font-bold border rounded ${getBadgeStyle(resource.type)}`}>
              {resource.type}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">{resource.source}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
            {resource.title}
          </h4>
        </div>
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all shrink-0"
      >
        <span>Open Resource</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
