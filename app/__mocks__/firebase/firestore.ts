/** Minimal Firestore mock: enough surface for the app's data layer in tests. */
const snap = (data: any = {}, exists = true) => ({
  id: 'mock-id',
  exists: () => exists,
  data: () => data,
});

export const getFirestore = () => ({ type: 'firestore' });
export const collection = (...args: any[]) => ({ type: 'collection', args });
export const doc = (...args: any[]) => ({ type: 'doc', args });
export const getDoc = jest.fn(async () => snap());
export const getDocs = jest.fn(async () => ({ docs: [], empty: true, size: 0 }));
export const setDoc = jest.fn(async () => undefined);
export const updateDoc = jest.fn(async () => undefined);
export const addDoc = jest.fn(async () => ({ id: 'mock-id' }));
export const deleteDoc = jest.fn(async () => undefined);
export const onSnapshot = jest.fn(() => () => {});
export const query = (...args: any[]) => ({ type: 'query', args });
export const where = (...args: any[]) => ({ type: 'where', args });
export const orderBy = (...args: any[]) => ({ type: 'orderBy', args });
export const limit = (...args: any[]) => ({ type: 'limit', args });
export const serverTimestamp = () => ({ type: 'serverTimestamp' });
export const increment = (n: number) => ({ type: 'increment', n });
export const arrayUnion = (...v: any[]) => ({ type: 'arrayUnion', v });
export const arrayRemove = (...v: any[]) => ({ type: 'arrayRemove', v });
export const Timestamp = {
  now: () => ({ toDate: () => new Date(), toMillis: () => Date.now() }),
  fromDate: (d: Date) => ({ toDate: () => d, toMillis: () => d.getTime() }),
};
export const writeBatch = () => ({
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  commit: jest.fn(async () => undefined),
});
