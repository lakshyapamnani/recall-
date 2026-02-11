
import React, { useState, useEffect, useMemo } from 'react';
import { Session, AppSettings, Task } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { dbService } from './services/db';
import { Recorder } from './components/Recorder';
import { SessionCard } from './components/SessionCard';
import { SummaryView } from './components/SummaryView';
import { SettingsModal } from './components/SettingsModal';
import { SetupGuide } from './components/SetupGuide';
import { TasksView } from './components/TasksView';
import { BandView } from './components/BandView';
import { Library, Mic, Settings, Search, BrainCircuit, ShieldCheck, HelpCircle, ListTodo, Watch } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'capture' | 'library' | 'tasks' | 'band' | 'setup'>('capture');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('recall_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sessionData = await dbService.getAllSessions();
    const taskData = await dbService.getAllTasks();
    setSessions(sessionData);
    setTasks(taskData);
  };

  const handleSessionComplete = async (session: Session) => {
    await dbService.saveSession(session);
    setSessions(prev => [session, ...prev]);

    if (session.summary.actionItems && session.summary.actionItems.length > 0) {
      const newTasks: Task[] = session.summary.actionItems.map(item => ({
        id: crypto.randomUUID(),
        sessionId: session.id,
        sessionTitle: session.title,
        text: item,
        completed: false,
        createdAt: Date.now(),
        isUrgent: /tomorrow|deadline|asap|priority|due|must|urgent/i.test(item)
      }));

      for (const t of newTasks) {
        await dbService.saveTask(t);
      }
      setTasks(prev => [...newTasks, ...prev]);
    }

    setSelectedSession(session);
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Delete this memory? All associated tasks will also be removed.')) {
      await dbService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      setTasks(prev => prev.filter(t => t.sessionId !== id));
      setSelectedSession(null);
    }
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    await dbService.updateSessionTitle(id, title);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title } : s));
    setTasks(prev => prev.map(t => t.sessionId === id ? { ...t, sessionTitle: title } : t));
  };

  const toggleTask = async (id: string) => {
    await dbService.toggleTask(id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = async (id: string) => {
    await dbService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('recall_settings', JSON.stringify(newSettings));
    setIsSettingsOpen(false);
  };

  const goToSessionFromTask = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.summary.shortSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const urgentTasksCount = tasks.filter(t => t.isUrgent && !t.completed).length;

  const tabs = useMemo(() => [
    { id: 'capture', label: 'Capture', icon: Mic },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'tasks', label: 'Tasks', icon: ListTodo, badge: urgentTasksCount > 0 },
    { id: 'band', label: 'Band', icon: Watch },
    { id: 'setup', label: 'Setup', icon: HelpCircle }
  ], [urgentTasksCount]);

  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  if (selectedSession) {
    return (
      <SummaryView 
        session={selectedSession} 
        onBack={() => setSelectedSession(null)} 
        onDelete={handleDeleteSession}
        onUpdateTitle={handleUpdateTitle}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <nav className="flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl glass-bright flex items-center justify-center shadow-lg border-white/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">RECALL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Local AI Core</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 glass-dark hover:glass-bright rounded-full flex items-center justify-center transition-all text-zinc-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'capture' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Recorder settings={settings} onSessionComplete={handleSessionComplete} />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="p-6 space-y-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight">Memories</h2>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text"
                  placeholder="Recall something..."
                  className="w-full glass-dark border-transparent focus:glass-bright focus:border-white/20 rounded-[1.5rem] py-5 pl-14 pr-6 text-white text-lg font-medium transition-all placeholder:text-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </header>

            {filteredSessions.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {filteredSessions.map(session => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onClick={() => setSelectedSession(session)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6">
                <div className="w-24 h-24 glass-dark rounded-[2.5rem] flex items-center justify-center mx-auto opacity-50">
                  <Library className="w-10 h-10 text-zinc-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-bold text-zinc-400">Silence is empty</p>
                    <p className="text-zinc-600 font-medium">Capture your first meeting to begin.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <TasksView 
              tasks={tasks} 
              onToggle={toggleTask} 
              onDelete={deleteTask}
              onGoToSession={goToSessionFromTask}
            />
          </div>
        )}

        {activeTab === 'band' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <BandView />
          </div>
        )}

        {activeTab === 'setup' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <SetupGuide />
           </div>
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          onSave={saveSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {/* Apple Glass Bottom Navigation Pill with Glide Effect */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 flex justify-center items-end pointer-events-none pb-10">
        <div className="relative glass-dark border border-white/10 p-2 flex gap-1 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] pointer-events-auto max-w-md w-full mx-auto backdrop-blur-3xl overflow-hidden">
          
          {/* Liquid Glide Indicator */}
          <div 
            className="absolute top-2 bottom-2 bg-white/10 backdrop-blur-md rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_4px_12px_rgba(255,255,255,0.05)] border border-white/10"
            style={{ 
              left: `calc(0.5rem + ${activeIndex * 20}%)`, 
              width: 'calc(20% - 0.5rem)' 
            }}
          />

          {tabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex-1 relative py-3.5 rounded-[2rem] flex flex-col items-center gap-1.5 transition-all duration-500 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className={`relative transition-all duration-500 ${isActive ? 'scale-125 -translate-y-0.5' : 'scale-100'}`}>
                  <Icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : ''}`} />
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900 shadow-sm animate-pulse" />
                  )}
                  {isActive && item.badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/20 shadow-sm" />
                  )}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 scale-95'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
