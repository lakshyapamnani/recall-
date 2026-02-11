
export enum SessionMode {
  MEETING = 'Meeting',
  LECTURE = 'Lecture',
  CONVERSATION = 'Conversation',
  INTERVIEW = 'Interview'
}

export interface SummaryOutput {
  shortSummary: string;
  keyTakeaways: string[];
  actionItems?: string[]; 
  mainConcepts?: string[];
}

export interface Session {
  id: string;
  timestamp: number;
  title: string;
  mode: SessionMode;
  duration: number; 
  transcript: string;
  summary: SummaryOutput;
}

export interface Task {
  id: string;
  sessionId: string;
  sessionTitle: string;
  text: string;
  completed: boolean;
  createdAt: number;
  isUrgent: boolean; 
}

export interface AppSettings {
  useGemini: boolean;
}
