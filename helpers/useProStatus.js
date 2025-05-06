// hooks/useProStatus.js
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function useProStatus() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsPro(false);
      setLoading(false);
      return;
    }

    const checkPro = async () => {
      try {
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        setIsPro(docSnap.exists() && docSnap.data().isPro === true);
      } catch (error) {
        console.error('🔥 Error checking Pro status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPro();
  }, [user]);

  return { isPro, loading };
}
