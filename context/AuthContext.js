// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInAnonymously } from '../services/firebaseRest';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, token }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Automatically sign in anonymously on mount
    (async () => {
      try {
        const data = await signInAnonymously();
        setUser({ id: data.localId, token: data.idToken });
      } catch (error) {
        console.error('❌ Auth initialization failed:', error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = {
    user,
    isLoading,
    isSignedIn: !!user,
    signOut: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
