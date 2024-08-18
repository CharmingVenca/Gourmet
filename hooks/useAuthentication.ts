import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/config/firebaseConfig';
import { doc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

type UserData = {
  username: string;
  fullName: string;
  grade: string;
  email: string;
  password: string;
  confirmPassword: string;
};

async function isUsernameUnique(username: string): Promise<boolean> {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

export function useAuthentication() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUp = async (userData: UserData) => {
    if (!Object.values(userData).every(field => field.trim() !== '')) {
      setError('All fields must be filled.');
      return;
    }

    if (userData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const isUnique = await isUsernameUnique(userData.username);
    if (!isUnique) {
      setError('Username already exists.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const userId = userCredential.user.uid;
      if (userId) {
        const userFirestoreData = {
          userUID: userId,
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          grade: userData.grade,
          role: 'guest',
          notes: {},
          contributions: {},
          inbox: []
        };
        await setDoc(doc(db, 'users', userId), userFirestoreData);
        setError(null);
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setError('All fields must be filled.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      if (userId) {
        setError(null);
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace('/screens/Welcome');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return { signUp, login, logout, error };
}