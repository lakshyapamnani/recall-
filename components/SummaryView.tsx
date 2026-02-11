
import React, { useState } from 'react';
import { Session } from '../types';
import { ChevronLeft, Share, Trash2, Edit2, FileText, CheckCircle2, Lightbulb, ListTodo, ChevronDown, ChevronUp } from 'lucide-react';

interface SummaryViewProps {
  session: Session;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ session, onBack, onDelete, onUpdateTitle }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(session.title);

  const handleTitleSubmit = () => {
    onUpdateTitle(session.id, editedTitle);
    setIsEditing(false);
  };

  const exportAsText = () => {
    const text = `Recall Session: ${session.title}\n...`; // Shortened for brevity
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col pb-32 animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <button onClick={onBack} className="w-11 h-11 glass-dark hover:glass-bright rounded-full flex items-center justify-center transition-all">
          <ChevronLeft className="w-6 h-6 text-zinc-300" />
        </button>
        <div className="flex-1 px-4 text-center">
          {isEditing ? (
            <input 
              autoFocus
              className="bg-zinc-900/50 border-white/10 rounded-xl px-4 py-2 text-center w-full font-black text-lg focus:ring-2 focus:ring-cyan-500/50 outline-none"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            />
          ) : (
            <h2 className="text-xl font-black truncate tracking-tight flex items-center justify-center gap-3">
              {session.title}
              <Edit2 className="w-4 h-4 text-zinc-600 cursor-pointer hover:text-white transition-colors" onClick={() => setIsEditing(true)} />
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportAsText} className="w-11 h-11 glass-dark hover:glass-bright rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <Share className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(session.id)} className="w-11 h-11 glass-dark hover:bg-red-500/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-10 max-w-3xl mx-auto w-full">
        {/* Hero Summary Card */}
        <section className="glass-bright border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            <FileText className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="px-3 py-1.5 glass-dark rounded-lg">
                <span className="text-cyan-400 font-black uppercase tracking-[0.25em] text-[10px]">Insight</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white leading-[1.4] tracking-tight">
            {session.summary.shortSummary}
          </p>
        </section>

        {/* Dynamic Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Key Takeaways */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 glass-bright rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-[11px] text-zinc-500">Takeaways</h3>
                </div>
                <div className="space-y-4">
                    {session.summary.keyTakeaways.map((point, i) => (
                        <div key={i} className="glass border-white/5 p-6 rounded-[2rem] flex gap-5 hover:glass-bright transition-all group">
                            <span className="text-zinc-600 font-black text-xl group-hover:text-zinc-400 transition-colors">{i+1}</span>
                            <p className="text-zinc-300 font-medium leading-relaxed">{point}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Action Items / Concepts */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 glass-bright rounded-lg flex items-center justify-center">
                        <ListTodo className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-[11px] text-zinc-500">Actions</h3>
                </div>
                <div className="glass-dark border-white/5 rounded-[2.5rem] overflow-hidden">
                    {session.summary.actionItems && session.summary.actionItems.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {session.summary.actionItems.map((item, i) => (
                                <div key={i} className="p-6 flex gap-4 items-center group hover:bg-white/5 transition-all">
                                    <div className="w-7 h-7 rounded-xl border-2 border-zinc-800 glass-dark group-hover:border-emerald-500/50 transition-all shrink-0" />
                                    <span className="text-zinc-300 font-medium text-sm leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center text-zinc-600 text-sm font-bold uppercase tracking-widest italic">No specific actions identified</div>
                    )}
                </div>
            </section>
        </div>

        {/* Collapsible Transcript Section */}
        <section className="pt-6">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full glass-dark border-white/5 p-7 rounded-[2rem] flex items-center justify-between text-zinc-400 font-black uppercase tracking-[0.2em] text-[11px] hover:glass-bright transition-all"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 opacity-40" />
              Raw Transcript
            </div>
            {showTranscript ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showTranscript && (
            <div className="mt-6 p-8 glass border-white/5 rounded-[2rem] text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-mono animate-in slide-in-from-top-2 duration-300 shadow-inner">
              {session.transcript}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
