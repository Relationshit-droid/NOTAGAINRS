import { useEffect, useState } from 'react';
import { auth } from '../lib/firebaseClient';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User, 
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  linkWithPopup,
  updateProfile
} from 'firebase/auth';
import { useAppStore } from '../state/store';
import { userApi } from '../lib/api';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  linkGoogle: () => Promise<void>;
  linkApple: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setUserId = useAppStore(state => state.setUserId);
  
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  
  const appleProvider = new OAuthProvider('apple.com');
  appleProvider.addScope('email');
  appleProvider.addScope('name');

  const syncUserToBackend = async (firebaseUser: User, displayName?: string) => {
    try {
      const token = await getIdToken(firebaseUser);
      const backendUser = await userApi.create(
        { email: firebaseUser.email!, display_name: displayName || firebaseUser.displayName || firebaseUser.email!.split('@')[0] },
        token
      );
      setUserId(backendUser.id);
      return backendUser;
    } catch (error) {
      console.error('Failed to sync user to backend:', error);
    }
  };

  // Fetch the backend user, or create them if this is the first login.
  const getOrCreateBackendUser = async (firebaseUser: User, displayName?: string) => {
    const token = await getIdToken(firebaseUser);
    try {
      const backendUser = await userApi.get(firebaseUser.uid, token);
      setUserId(backendUser.id);
      return backendUser;
    } catch (error: any) {
      // 404 = user exists in Firebase Auth but not yet in our backend.
      if (error?.statusCode === 404) {
        return await syncUserToBackend(firebaseUser, displayName);
      }
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const token = await getIdToken(user);
        try {
          const backendUser = await userApi.get(user.uid, token);
          setUserId(backendUser.id);
        } catch {
          // User might not exist in backend yet; sync on next action.
        }
      } else {
        setUserId(undefined);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await getOrCreateBackendUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      await syncUserToBackend(result.user, displayName);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await getOrCreateBackendUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithApple = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      setUser(result.user);
      await getOrCreateBackendUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const linkGoogle = async () => {
    if (!user) throw new Error('No user logged in');
    try {
      await linkWithPopup(user, googleProvider);
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Failed to link Google:', error);
      throw error;
    }
  };

  const linkApple = async () => {
    if (!user) throw new Error('No user logged in');
    try {
      await linkWithPopup(user, appleProvider);
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Failed to link Apple:', error);
      throw error;
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!user) throw new Error('No user logged in');
    try {
      await updateProfile(user, { displayName: name });
      setUser(auth.currentUser);
      
      const token = await getIdToken(user);
      await userApi.update(user.uid, { display_name: name }, token);
    } catch (error) {
      console.error('Failed to update display name:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserId(undefined);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    signInWithGoogle,
    signInWithApple,
    linkGoogle,
    linkApple,
    updateDisplayName,
  };
};