import { getFirestore, collection, getDocs, query, orderBy, limit, where, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  createdAt: Date;
  lastActive?: Date;
  isActive: boolean;
}

export interface AdminGame {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  plays: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalSessions: number;
  revenue: number;
  avgSessionDuration: number;
}

export interface AdminFlag {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface AdminSystemSettings {
  maintenanceMode: boolean;
  maxConcurrentGames: number;
  pushNotificationEnabled: boolean;
  analyticsEnabled: boolean;
}

export const adminApi = {
  /**
   * Fetch all admin data in one call
   */
  async fetchAll(): Promise<{
    users: AdminUser[];
    games: AdminGame[];
    analytics: AdminAnalytics;
    flags: AdminFlag[];
    systemSettings: AdminSystemSettings;
  }> {
    const [users, games, analytics, flags, systemSettings] = await Promise.all([
      this.fetchUsers(),
      this.fetchGames(),
      this.fetchAnalytics(),
      this.fetchFlags(),
      this.fetchSystemSettings(),
    ]);

    return { users, games, analytics, flags, systemSettings };
  },

  /**
   * Fetch all users from Firestore
   */
  async fetchUsers(limitCount = 100): Promise<AdminUser[]> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.display_name || data.displayName,
        role: data.role || 'user',
        createdAt: data.createdAt?.toDate() || new Date(),
        lastActive: data.lastActive?.toDate(),
        isActive: data.isActive !== false,
      };
    });
  },

  /**
   * Fetch all games from Firestore
   */
  async fetchGames(limitCount = 100): Promise<AdminGame[]> {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Unknown Game',
        category: data.category || 'uncategorized',
        difficulty: data.difficulty || 'medium',
        plays: data.plays || 0,
        rating: data.rating || 0,
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  },

  /**
   * Fetch analytics data
   */
  async fetchAnalytics(): Promise<AdminAnalytics> {
    const usersRef = collection(db, 'users');
    const gamesRef = collection(db, 'games');
    const sessionsRef = collection(db, 'gameSessions');
    
    const [usersSnap, gamesSnap, sessionsSnap] = await Promise.all([
      getDocs(usersRef),
      getDocs(gamesRef),
      getDocs(sessionsRef),
    ]);

    const totalUsers = usersSnap.size;
    const activeUsers = usersSnap.docs.filter(d => d.data().isActive !== false).length;
    const totalGames = gamesSnap.size;
    const totalSessions = sessionsSnap.size;
    
    // Calculate average session duration
    let totalDuration = 0;
    let sessionsWithDuration = 0;
    sessionsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.duration) {
        totalDuration += data.duration;
        sessionsWithDuration++;
      }
    });
    const avgSessionDuration = sessionsWithDuration > 0 ? totalDuration / sessionsWithDuration : 0;

    return {
      totalUsers,
      activeUsers,
      totalGames,
      totalSessions,
      revenue: 0, // TODO: calculate from subscriptions
      avgSessionDuration,
    };
  },

  /**
   * Fetch recent flags/alerts
   */
  async fetchFlags(limitCount = 50): Promise<AdminFlag[]> {
    const flagsRef = collection(db, 'adminFlags');
    const q = query(flagsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || 'info',
        title: data.title || 'Alert',
        description: data.description || '',
        timestamp: data.timestamp?.toDate() || new Date(),
        userId: data.userId,
        sessionId: data.sessionId,
      };
    });
  },

  /**
   * Fetch system settings
   */
  async fetchSystemSettings(): Promise<AdminSystemSettings> {
    const settingsRef = doc(db, 'admin', 'systemSettings');
    const snap = await getDoc(settingsRef);
    
    if (snap.exists()) {
      const data = snap.data();
      return {
        maintenanceMode: data.maintenanceMode || false,
        maxConcurrentGames: data.maxConcurrentGames || 100,
        pushNotificationEnabled: data.pushNotificationEnabled !== false,
        analyticsEnabled: data.analyticsEnabled !== false,
      };
    }
    
    return {
      maintenanceMode: false,
      maxConcurrentGames: 100,
      pushNotificationEnabled: true,
      analyticsEnabled: true,
    };
  },

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: Partial<AdminSystemSettings>): Promise<void> {
    const settingsRef = doc(db, 'admin', 'systemSettings');
    const { writeBatch } = await import('firebase/firestore');
    // Using setDoc with merge to update settings
    const { setDoc } = await import('firebase/firestore');
    await setDoc(settingsRef, settings, { merge: true });
  },

  /**
   * Update user role
   */
  async updateUserRole(uid: string, role: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const { setDoc } = await import('firebase/firestore');
    await setDoc(userRef, { role }, { merge: true });
  },

  /**
   * Delete a game
   */
  async deleteGame(gameId: string): Promise<void> {
    const gameRef = doc(db, 'games', gameId);
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(gameRef);
  },

  /**
   * Toggle game active status
   */
  async toggleGameActive(gameId: string, isActive: boolean): Promise<void> {
    const gameRef = doc(db, 'games', gameId);
    const { setDoc } = await import('firebase/firestore');
    await setDoc(gameRef, { isActive }, { merge: true });
  },
};

export default adminApi;