// context/AppContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    AsyncStorage.getItem('@theme').then((value) => {
      if (value !== null) {
        setIsDark(value === 'dark');
      }
    });
  }, []);

  // Save theme preference when changed
  useEffect(() => {
    AsyncStorage.setItem('@theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <AppContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
