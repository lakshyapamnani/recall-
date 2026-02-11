
import React from 'react';

export const BandView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 space-y-16 overflow-hidden">
      {/* 3D Band Representation */}
      <div className="relative perspective-[1000px] w-full max-w-xs aspect-square flex items-center justify-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse"></div>
        
        {/* The Band Object */}
        <div className="relative group transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12 cursor-default" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Strap - Grey Woven Pattern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[32px] border-[#3a3a3e] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.6)]" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(45deg, #3a3a3e, #3a3a3e 2px, #424246 2px, #424246 4px)',
                 transform: 'rotateX(60deg) translateY(-20px)'
               }}>
          </div>

          {/* Module - The Core Device */}
          <div className="relative w-28 h-44 bg-[#1a1a1c] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/5 flex flex-col items-center justify-start py-8 space-y-4 overflow-hidden"
               style={{ transform: 'translateZ(40px) translateY(-20px)' }}>
            
            {/* Top Glass Surface */}
            <div className="absolute inset-x-2 top-2 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-[1.5rem] pointer-events-none"></div>
            
            {/* Sensor / Mic Detail */}
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></div>
            
            {/* Side Grill Detail (Simplified) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-16 flex flex-col gap-1 pr-1.5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-1 w-full bg-zinc-800 rounded-full"></div>
                ))}
            </div>

            <div className="mt-auto pb-4">
               <div className="w-8 h-1 bg-zinc-800 rounded-full opacity-40"></div>
            </div>
          </div>

          {/* Depth effect layers */}
          <div className="absolute w-28 h-44 bg-black/40 rounded-[2rem] blur-xl -z-10" style={{ transform: 'translateZ(-10px) translateY(10px)' }}></div>
        </div>
      </div>

      {/* Liquid Glass Animated Text */}
      <div className="text-center space-y-6">
        <div className="relative inline-block group">
          <h2 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-white animate-text-shimmer">
            Recall Band
          </h2>
          {/* Liquid Glass Underlay */}
          <div className="absolute inset-0 -z-10 blur-2xl bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="px-6 py-2.5 glass-bright rounded-full border-cyan-500/20 shadow-lg relative overflow-hidden group">
             {/* Liquid Animation inside the tag */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
               Coming Soon
             </span>
          </div>
          <p className="text-zinc-500 text-sm font-medium max-w-[240px] leading-relaxed">
            The world's first fully offline AI wearable. Syncing seamlessly with your digital brain.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 4s linear infinite;
        }
        @keyframes text-shimmer {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};
