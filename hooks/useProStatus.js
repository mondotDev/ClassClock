// hooks/useProStatus.js
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseClient';

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

        if (docSnap.exists()) {
          setIsPro(docSnap.data().isPro === true);
        } else {
          setIsPro(false); // User doc doesn't exist
        }
      } catch (error) {
        console.warn('⚠️ Could not check Pro status:', error.message);
        setIsPro(false); // Graceful fallback on permission error
      } finally {
        setLoading(false);
      }
    };

    checkPro();
  }, [user]);

  return { isPro, loading };
}
