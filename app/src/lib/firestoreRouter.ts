/**
 * Firestore transport for the app's REST-shaped data layer.
 *
 * `api.ts` was written against a FastAPI service (`get('users/123')`,
 * `post('games/sessions', ...)`). That backend is prohibited by the
 * Firebase-only mandate, but its call sites are spread across ~80 screens and
 * hooks, so rewriting them all would be a large, risky change.
 *
 * Instead this module keeps the endpoint-shaped interface and services each
 * route directly from Firestore. `httpClient` delegates here, so every
 * existing `userApi.get(...)` / `gamesApi.createSession(...)` call keeps
 * working while the data actually lives in Firebase.
 *
 * In DEMO_MODE (or when Firebase is unconfigured) routes resolve from the
 * local fixtures in `demoData.ts`, which is what makes the preview runnable
 * without a Firebase project.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseClient';
import { ENV } from './env';
import {
  DEMO_USER,
  DEMO_PARTNER,
  DEMO_COUPLE,
  DEMO_CATEGORIES,
  DEMO_MARCIE_GREETING,
} from './demoData';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** True when we should serve local fixtures rather than hit Firestore. */
function useDemo(): boolean {
  return ENV.DEMO_MODE || !isFirebaseConfigured;
}

/** Splits 'games/categories/emotional?foo=1' into path parts and query params. */
function parse(endpoint: string): { parts: string[]; params: URLSearchParams } {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const [path, qs] = clean.split('?');
  return {
    parts: path.split('/').filter(Boolean),
    params: new URLSearchParams(qs || ''),
  };
}

async function readDoc<T>(col: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

/** In-memory store backing demo-mode writes so sessions behave consistently. */
const demoStore = new Map<string, any>();

function demoRoute(method: Method, parts: string[], params: URLSearchParams, body?: any): any {
  const [head, ...rest] = parts;

  if (head === 'users') {
    if (method === 'POST') return { ...DEMO_USER, ...body };
    const id = rest[0];
    if (rest[1] === 'sarcasm') {
      return { success: true, sarcasm_level: body?.level ?? 2, name: DEMO_USER.display_name };
    }
    if (method === 'PUT') return { ...DEMO_USER, ...body, id };
    return DEMO_USER;
  }

  if (head === 'couples') {
    if (rest[0] === 'me' || params.get('user_id')) return DEMO_COUPLE;
    if (rest[1] === 'presence') {
      return { user_online: true, partner_online: true, partner_name: DEMO_PARTNER.display_name };
    }
    if (method === 'POST' || method === 'PUT') return { ...DEMO_COUPLE, ...body };
    return DEMO_COUPLE;
  }

  if (head === 'games') {
    if (rest[0] === 'categories' && rest.length === 1) return { categories: DEMO_CATEGORIES };
    if (rest[0] === 'categories') {
      const cat = DEMO_CATEGORIES.find(c => c.id === rest[1]) ?? DEMO_CATEGORIES[0];
      return { ...cat, games_detail: [] };
    }
    if (rest[0] === 'registry') {
      return { games: {}, total_games: 0, categories: DEMO_CATEGORIES.length };
    }
    if (rest[0] === 'sessions') {
      const id = rest[1] || `demo-session-${Date.now()}`;
      if (method === 'POST' && !rest[1]) {
        const session = {
          id,
          game_id: body?.game_id ?? 'demo-game',
          category_id: body?.category_id ?? 'love-arcade',
          couple_id: body?.couple_id ?? DEMO_COUPLE.id,
          user_id: DEMO_USER.id,
          status: 'in_progress',
          score: 0,
          created_at: new Date().toISOString(),
        };
        demoStore.set(id, session);
        return session;
      }
      const existing = demoStore.get(id) ?? { id, status: 'in_progress', score: 0 };
      if (method === 'PUT' || method === 'POST') {
        const next = { ...existing, ...body };
        demoStore.set(id, next);
        return next;
      }
      return existing;
    }
    return { games: [], id: rest[0] };
  }

  if (head === 'sos') {
    const id = rest[1] || `demo-sos-${Date.now()}`;
    if (method === 'POST') return { id, status: 'active', ...body };
    return { id, status: 'active', verdict: null };
  }

  if (head === 'marcie') {
    return { reply: DEMO_MARCIE_GREETING, response: DEMO_MARCIE_GREETING };
  }

  if (head === 'leaderboard') return { entries: [] };
  if (head === 'health') return { status: 'ok', mode: 'demo' };

  return {};
}

/**
 * Routes a REST-shaped request to Firestore.
 * Throws for genuinely unsupported routes so callers surface a clear error.
 */
export async function request<T>(
  method: Method,
  endpoint: string,
  body?: any
): Promise<T> {
  const { parts, params } = parse(endpoint);

  if (useDemo()) {
    return demoRoute(method, parts, params, body) as T;
  }

  const [head, ...rest] = parts;

  // -- users ---------------------------------------------------------------
  if (head === 'users') {
    if (method === 'POST') {
      const ref = doc(collection(db, 'users'));
      const payload = { ...body, created_at: serverTimestamp() };
      await setDoc(ref, payload);
      return { id: ref.id, ...body } as T;
    }
    const userId = rest[0];
    if (rest[1] === 'sarcasm') {
      await updateDoc(doc(db, 'users', userId), { sarcasm_level: body.level });
      const u = await readDoc<any>('users', userId);
      return { success: true, sarcasm_level: body.level, name: u?.display_name } as T;
    }
    if (method === 'PUT') {
      await updateDoc(doc(db, 'users', userId), body);
      return (await readDoc<T>('users', userId)) as T;
    }
    const user = await readDoc<T>('users', userId);
    if (!user) throw new Error(`User ${userId} not found`);
    return user;
  }

  // -- couples -------------------------------------------------------------
  if (head === 'couples') {
    if (rest[0] === 'me') {
      const userId = params.get('user_id');
      const q = query(
        collection(db, 'couples'),
        where('partners', 'array-contains', userId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) throw new Error('No couple found for user');
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as T;
    }
    if (rest[0] === 'join' || rest[0] === 'create') {
      const ref = await addDoc(collection(db, 'couples'), {
        ...body,
        created_at: serverTimestamp(),
      });
      return { id: ref.id, ...body } as T;
    }
    const coupleId = rest[0];
    if (rest[1] === 'presence') {
      const c = await readDoc<any>('couples', coupleId);
      return { user_online: true, partner_online: !!c, partner_name: c?.partner_name } as T;
    }
    if (method === 'PUT' || method === 'POST') {
      await updateDoc(doc(db, 'couples', coupleId), body);
      return (await readDoc<T>('couples', coupleId)) as T;
    }
    const couple = await readDoc<T>('couples', coupleId);
    if (!couple) throw new Error(`Couple ${coupleId} not found`);
    return couple;
  }

  // -- games ---------------------------------------------------------------
  if (head === 'games') {
    if (rest[0] === 'categories' && rest.length === 1) {
      const snap = await getDocs(collection(db, 'gameCategories'));
      return { categories: snap.docs.map(d => ({ id: d.id, ...d.data() })) } as T;
    }
    if (rest[0] === 'categories') {
      const cat = await readDoc<any>('gameCategories', rest[1]);
      return { ...(cat ?? { id: rest[1] }), games_detail: [] } as T;
    }
    if (rest[0] === 'registry') {
      const snap = await getDocs(collection(db, 'games'));
      const games: Record<string, any> = {};
      snap.docs.forEach(d => {
        games[d.id] = { id: d.id, ...d.data() };
      });
      return { games, total_games: snap.size, categories: 0 } as T;
    }
    if (rest[0] === 'sessions') {
      if (method === 'POST' && !rest[1]) {
        const ref = await addDoc(collection(db, 'gameSessions'), {
          ...body,
          status: 'in_progress',
          created_at: serverTimestamp(),
        });
        return { id: ref.id, ...body, status: 'in_progress' } as T;
      }
      const sessionId = rest[1];
      if (rest[2] === 'answers') {
        const ref = await addDoc(
          collection(db, 'gameSessions', sessionId, 'answers'),
          { ...body, created_at: serverTimestamp() }
        );
        return { id: ref.id, ...body } as T;
      }
      if (method === 'PUT' || method === 'POST') {
        await updateDoc(doc(db, 'gameSessions', sessionId), body);
        return (await readDoc<T>('gameSessions', sessionId)) as T;
      }
      const s = await readDoc<T>('gameSessions', sessionId);
      if (!s) throw new Error(`Session ${sessionId} not found`);
      return s;
    }
    const game = await readDoc<T>('games', rest[0]);
    if (!game) throw new Error(`Game ${rest[0]} not found`);
    return game;
  }

  // -- sos -----------------------------------------------------------------
  if (head === 'sos') {
    if (method === 'POST' && rest[0] === 'sessions') {
      const ref = await addDoc(collection(db, 'fights'), {
        ...body,
        status: 'active',
        created_at: serverTimestamp(),
      });
      return { id: ref.id, ...body, status: 'active' } as T;
    }
    const fightId = rest[1];
    if (method === 'POST' || method === 'PUT') {
      await updateDoc(doc(db, 'fights', fightId), body);
      return (await readDoc<T>('fights', fightId)) as T;
    }
    const f = await readDoc<T>('fights', fightId);
    if (!f) throw new Error(`SOS session ${fightId} not found`);
    return f;
  }

  if (head === 'health') {
    return { status: 'ok', mode: 'firestore' } as T;
  }

  throw new Error(
    `Unsupported endpoint '${endpoint}'. Routes are served from Firestore; ` +
      `AI and TTS routes must go through Cloud Functions.`
  );
}
