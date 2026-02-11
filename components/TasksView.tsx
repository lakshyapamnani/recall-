
import React, { useMemo } from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Trash2, Bell, AlertCircle, Calendar } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onGoToSession: (sessionId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onToggle, onDelete, onGoToSession }) => {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return b.createdAt - a.createdAt;
    });
  }, [tasks]);

  const urgentCount = tasks.filter(t => t.isUrgent && !t.completed).length;

  return (
    <div className="p-6 space-y-10 max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <header className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black tracking-tight">Focus</h2>
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 glass-liquid bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">
              <Bell className="w-3 h-3 fill-red-400" />
              {urgentCount} High Priority
            </div>
          )}
        </div>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">AI-extracted insights from your sessions.</p>
      </header>

      {sortedTasks.length > 0 ? (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div 
              key={task.id}
              className={`glass-liquid border-white/5 rounded-[2rem] p-6 transition-all group relative overflow-hidden ${
                task.completed ? 'opacity-30 grayscale-[0.8]' : task.isUrgent ? 'border-red-500/20 bg-red-500/5' : 'hover:glass-bright hover:border-white/10'
              }`}
            >
              {/* Iridescent shimmer */}
              {!task.completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
              )}
              
              <div className="flex gap-5 relative z-10">
                <button 
                  onClick={() => onToggle(task.id)}
                  className="mt-1 shrink-0 transition-transform active:scale-75"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 fill-emerald-400/10 stroke-[2px]" />
                  ) : (
                    <Circle className={`w-8 h-8 stroke-[2px] ${task.isUrgent ? 'text-red-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  )}
                </button>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className={`text-xl font-bold leading-[1.3] tracking-tight ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-100 group-hover:text-white transition-colors'}`}>
                      {task.text}
                    </p>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 glass-dark rounded-full text-zinc-600 hover:text-red-400 transition-all active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => onGoToSession(task.sessionId)}
                      className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.2em] px-2.5 py-1.5 glass-dark rounded-lg hover:glass-bright transition-all border border-white/5"
                    >
                      Ref: {task.sessionTitle}
                    </button>
                    {task.isUrgent && !task.completed && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Urgent
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-8">
          <div className="w-24 h-24 glass-liquid rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
          </div>
          <div className="space-y-3">
              <p className="text-2xl font-black text-zinc-400">All Clear</p>
              <p className="text-zinc-600 font-medium font-mono tracking-tighter">Everything is captured and recalled.</p>
          </div>
        </div>
      )}
    </div>
  );
};
