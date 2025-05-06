// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInAnonymously } from '../services/firebaseRest';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // { id, token }
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from AsyncStorage or sign in anonymously
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user');
        if (savedUser) {
          setUserState(JSON.parse(savedUser));
        } else {
          const data = await signInAnonymously();
          const anonUser = { id: data.localId, token: data.idToken };
          setUserState(anonUser);
          await AsyncStorage.setItem('@user', JSON.stringify(anonUser));
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Shared way to set user (e.g. after Google sign-in)
  const setUser = async (incomingUser) => {
    const userObj = {
      id: incomingUser.localId || incomingUser.uid || incomingUser.id,
      token: incomingUser.idToken || incomingUser.token,
      email: incomingUser.email ?? null,
      name: incomingUser.displayName ?? null,
      photoUrl: incomingUser.photoUrl ?? null,
    };
    setUserState(userObj);
    await AsyncStorage.setItem('@user', JSON.stringify(userObj));
  };

  const signOut = async () => {
    setUserState(null);
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        setUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
