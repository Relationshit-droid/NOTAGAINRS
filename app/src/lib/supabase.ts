/**
 * Firebase-backed data layer.
 *
 * NOTE ON THE FILENAME / API SHAPE
 * --------------------------------
 * ~30 game screens were written against a Supabase-shaped module that never
 * actually existed in this repo (every import of `../../lib/supabase` was a
 * hard build failure). Supabase is a PROHIBITED dependency for this project —
 * the mandated stack is Firebase only.
 *
 * Rather than hand-edit 30 screens (and risk touching the game content that
 * must be preserved verbatim), this module keeps the exact call signatures the
 * screens already use and implements every one of them on top of Firebase
 * Auth + Firestore. No Supabase SDK, no Supabase network calls.
 *
 * The `supabase` export is a thin shim exposing only the two surfaces the
 * screens touch: `.auth.getSession()` and `.from(table).select().eq().single()`.
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebaseClient';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Game {
  id: string;
  name?: string;
  category?: string;
  difficulty?: string;
  xp?: number;
  description?: string;
  mechanics?: string;
  marcieIntro?: string;
  [key: string]: any;
}

export interface Profile {
  user_id: string;
  couple_code?: string | null;
  sarcasm_level?: number;
  personality?: string;
  plan?: string;
  beta_code?: string | null;
  beta_active?: boolean;
  preview_mode?: boolean;
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

/** Resolves the current Firebase user once auth state is known. */
const currentUser = (): Promise<any> =>
  new Promise((resolve) => {
    try {
      if (auth.currentUser) return resolve(auth.currentUser);
      // Don't hang forever when no Firebase project is configured.
      const timer = setTimeout(() => resolve(null), 2000);
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          clearTimeout(timer);
          unsub();
          resolve(u);
        },
        () => {
          clearTimeout(timer);
          resolve(null);
        },
      );
    } catch {
      resolve(null);
    }
  });

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

/** Returns a `{ data, error }` envelope to match the call sites. */
export async function getProfile(userId: string): Promise<{ data: Profile | null; error: unknown }> {
  if (!userId) return { data: null, error: null };
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return { data: snap.exists() ? ({ user_id: userId, ...snap.data() } as Profile) : null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function upsertProfile(profile: Partial<Profile> & { user_id: string }) {
  const { user_id, ...rest } = profile;
  await setDoc(doc(db, 'users', user_id), { ...rest, updatedAt: serverTimestamp() }, { merge: true });
  return { user_id, ...rest };
}

export async function resetPassword(email: string, _redirectTo?: string) {
  await sendPasswordResetEmail(auth, email);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

export async function listGames(max = 200): Promise<Game[]> {
  const snap = await getDocs(query(collection(db, 'games'), fbLimit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
}

// ---------------------------------------------------------------------------
// Game sessions
// ---------------------------------------------------------------------------

export async function createGameSession(
  gameId: string,
  userId: string,
  coupleCode?: string | null,
) {
  const ref = await addDoc(collection(db, 'gameSessions'), {
    game_id: gameId,
    user_id: userId,
    couple_code: coupleCode ?? null,
    status: 'in_progress',
    score: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, game_id: gameId, user_id: userId, couple_code: coupleCode ?? null };
}

export async function updateGameSession(sessionId: string | null | undefined, patch: Record<string, any>) {
  if (!sessionId) return null;
  await updateDoc(doc(db, 'gameSessions', sessionId), { ...patch, updatedAt: serverTimestamp() });
  return { id: sessionId, ...patch };
}

// ---------------------------------------------------------------------------
// Fights (SOS Fight Solver)
// ---------------------------------------------------------------------------

export async function updateFight(fightId: string, patch: Record<string, any>) {
  if (!fightId) return null;
  await updateDoc(doc(db, 'fights', fightId), { ...patch, updatedAt: serverTimestamp() });
  return { id: fightId, ...patch };
}

/**
 * Realtime subscription to a single fight document.
 * Returns an object exposing `unsubscribe()`; also usable via removeChannel().
 */
export function subscribeFight(fightId: string, onChange: (payload: any) => void) {
  if (!fightId) return { unsubscribe: () => {} };
  const unsub = onSnapshot(doc(db, 'fights', fightId), (snap) => {
    onChange({ new: snap.exists() ? { id: snap.id, ...snap.data() } : null });
  });
  return { unsubscribe: unsub };
}

// ---------------------------------------------------------------------------
// Compatibility shim
// ---------------------------------------------------------------------------

/** Maps the legacy table names used by the screens onto Firestore collections. */
const TABLE_TO_COLLECTION: Record<string, string> = {
  profiles: 'users',
  games: 'games',
  game_sessions: 'gameSessions',
  fights: 'fights',
  couples: 'couples',
};

function buildQuery(table: string) {
  const collectionName = TABLE_TO_COLLECTION[table] ?? table;
  const filters: Array<[string, any]> = [];

  const api = {
    select(_columns?: string) {
      return api;
    },
    eq(column: string, value: any) {
      filters.push([column, value]);
      return api;
    },
    async single() {
      try {
        // `profiles` is keyed by user id, so a user_id filter is a direct doc read.
        if (collectionName === 'users') {
          const idFilter = filters.find(([c]) => c === 'user_id' || c === 'id');
          if (idFilter) {
            const snap = await getDoc(doc(db, 'users', String(idFilter[1])));
            return { data: snap.exists() ? { user_id: snap.id, ...snap.data() } : null, error: null };
          }
        }
        let q: any = collection(db, collectionName);
        if (filters.length) {
          q = query(q, ...filters.map(([c, v]) => where(c, '==', v)), fbLimit(1));
        } else {
          q = query(q, fbLimit(1));
        }
        const snap = await getDocs(q);
        const d = snap.docs[0];
        return { data: d ? { id: d.id, ...(d.data() as any) } : null, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    async then(resolve: any, reject?: any) {
      // Allows `await supabase.from(x).select()` without `.single()`.
      try {
        let q: any = collection(db, collectionName);
        if (filters.length) q = query(q, ...filters.map(([c, v]) => where(c, '==', v)));
        const snap = await getDocs(q);
        return resolve({ data: snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })), error: null });
      } catch (error) {
        return reject ? reject(error) : resolve({ data: null, error });
      }
    },
  };

  return api;
}

export const supabase = {
  auth: {
    async getSession() {
      const user = await currentUser();
      return {
        data: {
          session: user ? { user: { id: user.uid, email: user.email } } : null,
          user: user ? { id: user.uid, email: user.email } : null,
        },
        error: null,
      };
    },
  },
  from(table: string) {
    return buildQuery(table);
  },
  removeChannel(channel: any) {
    if (channel && typeof channel.unsubscribe === 'function') channel.unsubscribe();
  },
};

export default supabase;
