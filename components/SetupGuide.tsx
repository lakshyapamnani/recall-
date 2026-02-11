
import React from 'react';
import { Terminal, Download, Rocket, ExternalLink, Cloud } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-md mx-auto animate-in fade-in duration-500">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-black">AI Configuration</h2>
        <p className="text-zinc-500 text-sm">How Recall handles your voice</p>
      </header>

      <div className="space-y-6">
        <div className="glass-bright border-cyan-500/20 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3 text-cyan-400 font-bold">
            <Cloud className="w-5 h-5" />
            Transcription (Cloud Only)
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Transcription now runs on Google Gemini Flash. This ensures 99% accuracy and zero device battery drain while processing audio.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3 text-white font-bold">
            <Download className="w-5 h-5" />
            Hybrid Local Summary (Optional)
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">If you want summaries to stay on your hardware, install Ollama:</p>
          <div className="bg-black p-3 rounded-xl font-mono text-[10px] text-zinc-300">
            ollama run llama3
          </div>
          <div className="text-[10px] text-zinc-500 italic mt-2">
            Set OLLAMA_ORIGINS="*" in your environment.
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-zinc-600 px-8 leading-relaxed uppercase tracking-widest font-black">
        Recall prioritizes your privacy even in cloud mode.
      </div>
    </div>
  );
};
