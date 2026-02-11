
import React from 'react';
import { Session } from '../types';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins}m`;
  };

  return (
    <button 
      onClick={onClick}
      className="w-full glass-liquid border-white/10 rounded-[2.5rem] p-7 text-left hover:glass-bright hover:border-white/20 transition-all active:scale-[0.98] group relative overflow-hidden"
    >
      {/* Liquid Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="bg-white/5 backdrop-blur-md text-cyan-300 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          {session.mode}
        </span>
        <div className="w-10 h-10 glass-dark rounded-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 border border-white/5">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight line-clamp-1 relative z-10 drop-shadow-sm">
        {session.title}
      </h3>
      <p className="text-zinc-400 text-sm font-medium line-clamp-2 leading-relaxed mb-6 relative z-10">
        {session.summary.shortSummary}
      </p>

      <div className="flex items-center gap-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] relative z-10">
        <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
          <Calendar className="w-4 h-4 opacity-40" />
          {formatDate(session.timestamp)}
        </div>
        <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
          <Clock className="w-4 h-4 opacity-40" />
          {formatDuration(session.duration)}
        </div>
      </div>
    </button>
  );
};
