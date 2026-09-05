
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseClient';

const functions = getFunctions(app);
const validateBetaCodeCallable = httpsCallable(functions, 'validateBetaCode');

export function useBetaAccess() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateCode = async (code: string) => {
    setIsChecking(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await validateBetaCodeCallable({ code });
      if ((result.data as any).success) {
        setSuccess(true);
        return true;
      } else {
        throw new Error('Unknown error');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to validate code.');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking, error, success, validateCode };
}
