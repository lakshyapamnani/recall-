
import React from 'react';
import { AppSettings } from '../types';
import { X, Settings2, ShieldCheck, Cpu } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="glass-liquid border-white/20 rounded-[3.5rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl glass-bright flex items-center justify-center shadow-lg border-white/10">
              <Settings2 className="w-7 h-7 text-cyan-300" />
            </div>
            <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">Engine</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">AI Neural Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 glass-dark hover:glass-bright rounded-full flex items-center justify-center transition-all border border-white/10 group">
            <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="p-6 glass-liquid rounded-[2rem] flex items-start gap-5 text-left border-emerald-500/30 bg-emerald-500/5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-zinc-200 font-black uppercase tracking-wider">Gemini Intelligence Active</p>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                High-fidelity neural processing is active. Every session is summarized with native Gemini 2.0 architecture for superior insight extraction.
              </p>
            </div>
          </div>

          <div className="p-6 glass-liquid rounded-[2rem] flex items-center justify-between border-white/10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-300" />
               </div>
               <span className="font-black text-sm uppercase tracking-widest text-zinc-300">Neural Model</span>
            </div>
            <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
              gemini-2.0-flash
            </span>
          </div>
        </div>

        <div className="p-10 bg-black/40 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full glass-bright text-white font-black text-xl py-6 rounded-[2rem] transition-all shadow-2xl hover:bg-white/10 active:scale-95 border border-white/10"
          >
            Confirm Settings
          </button>
        </div>
      </div>
    </div>
  );
};
