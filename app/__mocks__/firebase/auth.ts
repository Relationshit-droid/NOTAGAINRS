/** Minimal Firebase Auth mock. Tests run signed-out unless they override this. */
export const getAuth = () => ({
  currentUser: null,
  onAuthStateChanged: (cb: (u: null) => void) => {
    cb(null);
    return () => {};
  },
});
export const onAuthStateChanged = jest.fn((_auth: any, cb: (u: null) => void) => {
  cb(null);
  return () => {};
});
export const signInWithEmailAndPassword = jest.fn(async () => ({ user: { uid: 'mock-uid' } }));
export const createUserWithEmailAndPassword = jest.fn(async () => ({ user: { uid: 'mock-uid' } }));
export const signOut = jest.fn(async () => undefined);
export const sendPasswordResetEmail = jest.fn(async () => undefined);
export const updateProfile = jest.fn(async () => undefined);
export const GoogleAuthProvider = class {};
export const signInWithCredential = jest.fn(async () => ({ user: { uid: 'mock-uid' } }));
