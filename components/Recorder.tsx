
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Info, Check, Shield, Activity } from 'lucide-react';
import { SessionMode, Session, AppSettings } from '../types';
import { AIService } from '../services/ai';

interface RecorderProps {
  settings: AppSettings;
  onSessionComplete: (session: Session) => void;
  onBack?: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Recorder: React.FC<RecorderProps> = ({ settings, onSessionComplete, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [selectedMode, setSelectedMode] = useState<SessionMode>(SessionMode.MEETING);
  const [status, setStatus] = useState<'idle' | 'recording' | 'summarizing'>('idle');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);
  const transcriptBufferRef = useRef<string>('');
  const lastProcessedIndexRef = useRef<number>(0);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('❌ Speech Recognition API not available');
      setError('Your browser does not support the Web Speech API. Please use Chrome or Edge.');
      return;
    }

    console.log('✅ Speech Recognition API available');

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      console.log('✅ Speech Recognition initialized with settings:', {
        continuous: recognition.continuous,
        interimResults: recognition.interimResults,
        lang: recognition.lang
      });

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        // Only process new results to avoid duplicates
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            // Only add if we haven't processed this index yet
            if (i >= lastProcessedIndexRef.current) {
              finalTranscript += event.results[i][0].transcript + ' ';
              console.log('📝 Final transcript (index ' + i + '):', event.results[i][0].transcript);
              lastProcessedIndexRef.current = i + 1;
            }
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          transcriptBufferRef.current += finalTranscript;
        }
        setLiveTranscript(transcriptBufferRef.current + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error, event);

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('🎤 Microphone access denied. Please allow microphone permissions in your browser settings.');
          stopRecording();
        } else if (event.error === 'network') {
          setError('🌐 Network error. Speech Recognition requires internet connection.');
          stopRecording();
        } else if (event.error === 'no-speech') {
          console.warn('⚠️ No speech detected, continuing...');
          // Don't stop recording, just log it
        } else if (event.error === 'audio-capture') {
          setError('🎤 No microphone found. Please connect a microphone and try again.');
          stopRecording();
        } else if (event.error === 'aborted') {
          console.warn('⚠️ Speech recognition aborted');
        } else {
          setError(`Speech recognition error: ${event.error}`);
          stopRecording();
        }
      };

      recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
      };

      recognitionRef.current = recognition;
      console.log('✅ Speech Recognition setup complete');
    } catch (error) {
      console.error('❌ Error initializing Speech Recognition:', error);
      setError('Failed to initialize speech recognition. Please refresh the page and try again.');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
          console.log('🧹 Speech recognition cleaned up');
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      }
    };
  }, []);

  // Handle speech recognition restart when it times out
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        console.log('🛑 Speech recognition ended');
        // If we were supposed to be recording, restart (Web Speech API sometimes timeouts)
        if (isRecording) {
          try {
            console.log('🔄 Restarting speech recognition...');
            recognitionRef.current.start();
          } catch (e) {
            console.error('❌ Speech recognition restart failed:', e);
          }
        }
      };
    }
  }, [isRecording]);

  const startRecording = async () => {
    console.log('🎬 Starting recording...');

    if (!recognitionRef.current) {
      console.error('❌ Speech recognition not initialized');
      setError('Speech recognition not initialized. Please refresh the page.');
      return;
    }

    try {
      setError(null);
      setLiveTranscript('');
      transcriptBufferRef.current = '';
      lastProcessedIndexRef.current = 0;

      console.log('▶️ Starting speech recognition...');
      recognitionRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000) as unknown as number;

      console.log('✅ Recording started successfully');
    } catch (err: any) {
      console.error('❌ Error starting recording:', err);
      if (err.name === 'InvalidStateError') {
        setError('Speech recognition is already running. Please wait a moment and try again.');
      } else {
        setError('Could not start recording. Check microphone permissions and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatus('idle');

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // If we have a transcript, process it
      const finalFullText = (transcriptBufferRef.current + liveTranscript).trim();
      if (finalFullText) {
        processTranscript(finalFullText);
      }
    }
  };

  const processTranscript = async (text: string) => {
    try {
      setStatus('summarizing');
      const summary = await AIService.summarize(text, selectedMode, settings);

      const newSession: Session = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: `Recall ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        mode: selectedMode,
        duration: recordingTime,
        transcript: text,
        summary
      };

      onSessionComplete(newSession);
      setStatus('idle');
      setLiveTranscript('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during local AI processing.');
      setStatus('idle');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'summarizing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <div className="relative w-32 h-32 glass-bright rounded-full flex items-center justify-center shadow-inner">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin stroke-[1.5px]" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Synthesizing Insight</h2>
        <p className="text-zinc-400 max-w-xs leading-relaxed font-medium">
          Analyzing patterns with local {settings.modelName} model. 100% private.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-8 px-6 flex flex-col min-h-[80vh]">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 glass-dark rounded-full flex items-center justify-center hover:glass-bright transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="flex-1 space-y-10">
        <header className="text-center space-y-3">
          <h1 className="text-5xl font-black tracking-tighter text-white">Capture</h1>
        </header>

        {!isRecording ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 gap-4">
              {Object.values(SessionMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`p-5 rounded-[2rem] transition-all text-left relative overflow-hidden group active:scale-95 ${selectedMode === mode
                    ? 'glass-bright border-white/20 shadow-xl'
                    : 'glass border-transparent text-zinc-400 hover:glass-dark'
                    }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-40">Mode</div>
                  <div className="text-xl font-bold tracking-tight">{mode}</div>
                  {selectedMode === mode && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-lg">
                      <Check className="w-3 h-3 text-black stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={startRecording}
              className="glass-dark rounded-[2.5rem] p-6 flex items-start gap-5 hover:glass-bright transition-all active:scale-95 w-full text-left"
            >
              <div className="w-12 h-12 rounded-2xl glass-bright flex items-center justify-center shrink-0 shadow-lg">
                <Activity className="w-6 h-6 text-zinc-300" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-200">Real-time Capture</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Words are transcribed instantly as you speak. Local Ollama handles the heavy lifting after you finish.
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-10 py-4 animate-in zoom-in-95 duration-500">
            <div className="text-8xl font-black tracking-tighter text-white font-mono opacity-90 flex items-center gap-4">
              <span className="relative">
                {formatTime(recordingTime)}
                <span className="absolute -top-1 -right-4 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-0 pulse-ring bg-cyan-500/20 rounded-full blur-xl"></div>
              <button
                onClick={stopRecording}
                className="relative w-48 h-48 rounded-full glass border-white/10 flex items-center justify-center shadow-2xl active:scale-95 transition-all"
              >
                <div className="w-40 h-40 rounded-full glass-bright flex items-center justify-center shadow-inner border-white/20">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden relative">
                    <Square className="w-12 h-12 text-black z-10 fill-black" />
                    {/* Animated sound bars */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 pb-8 h-full">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-black/10 rounded-full animate-[bounce_1s_infinite]"
                          style={{ height: `${20 + Math.random() * 40}%`, animationDelay: `${i * 0.15}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Live Transcript Card */}
            <div className="w-full glass-dark rounded-[2rem] p-6 min-h-[140px] border border-white/5 relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Signal Live</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-cyan-500' : 'bg-zinc-800'}`}></div>
                  ))}
                </div>
              </div>
              <p className="text-zinc-200 text-sm font-medium leading-relaxed italic overflow-y-auto max-h-24 custom-scrollbar">
                {liveTranscript || "Listening for speech..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-5 glass-dark border-red-500/30 text-red-400 rounded-3xl text-sm font-bold flex gap-4 items-center animate-in slide-in-from-top-4">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-[10px] uppercase font-black opacity-50 hover:opacity-100">Dismiss</button>
        </div>
      )}
    </div>
  );
};
