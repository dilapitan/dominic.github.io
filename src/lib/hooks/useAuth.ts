import { useState, useEffect } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if the user's email is authorized
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError('Unauthorized email address');
        return false;
      }
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in');
      return false;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign out');
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
  };
} 