
import { openDB, IDBPDatabase } from 'idb';
import { Session, Task } from '../types';
import { DB_NAME, STORE_NAME, TASK_STORE_NAME } from '../constants';

class DatabaseService {
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = openDB(DB_NAME, 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
        if (oldVersion < 2) {
          const taskStore = db.createObjectStore(TASK_STORE_NAME, { keyPath: 'id' });
          taskStore.createIndex('createdAt', 'createdAt');
          taskStore.createIndex('sessionId', 'sessionId');
        }
      },
    });
  }

  async saveSession(session: Session): Promise<void> {
    const db = await this.db;
    await db.put(STORE_NAME, session);
  }

  async getAllSessions(): Promise<Session[]> {
    const db = await this.db;
    const sessions = await db.getAllFromIndex(STORE_NAME, 'timestamp');
    return sessions.reverse(); // Newest first
  }

  async deleteSession(id: string): Promise<void> {
    const db = await this.db;
    await db.delete(STORE_NAME, id);
    const tasks = await this.getAllTasks();
    const tasksToDelete = tasks.filter(t => t.sessionId === id);
    for (const task of tasksToDelete) {
      await db.delete(TASK_STORE_NAME, task.id);
    }
  }

  async updateSessionTitle(id: string, title: string): Promise<void> {
    const db = await this.db;
    const session = await db.get(STORE_NAME, id);
    if (session) {
      session.title = title;
      await db.put(STORE_NAME, session);
    }
  }

  async saveTask(task: Task): Promise<void> {
    const db = await this.db;
    await db.put(TASK_STORE_NAME, task);
  }

  async getAllTasks(): Promise<Task[]> {
    const db = await this.db;
    return db.getAllFromIndex(TASK_STORE_NAME, 'createdAt');
  }

  // Fix: Completed the truncated toggleTask method and resolved the 'TASK' vs 'task' reference error
  async toggleTask(id: string): Promise<void> {
    const db = await this.db;
    const task = await db.get(TASK_STORE_NAME, id);
    if (task) {
      task.completed = !task.completed;
      await db.put(TASK_STORE_NAME, task);
    }
  }

  // Fix: Added missing deleteTask method as it is utilized in App.tsx
  async deleteTask(id: string): Promise<void> {
    const db = await this.db;
    await db.delete(TASK_STORE_NAME, id);
  }
}

// Fix: Exporting dbService instance to resolve 'Module has no exported member dbService' error in App.tsx
export const dbService = new DatabaseService();
