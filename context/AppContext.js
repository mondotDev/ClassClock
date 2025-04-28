// context/AppContext.js

import React, { createContext, useContext, useState } from 'react';

// Create the Context
const AppContext = createContext();

// Default Initial States
const initialSettings = {
  isDarkMode: false,
  is24HourTime: false,
};

const initialSchedules = {
  schedules: [],          // list of schedules
  activeScheduleId: null,  // which schedule is active
};

const initialUser = {
  isProUser: false,        // Pro status
};

// Provider
export function AppProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [user, setUser] = useState(initialUser);

  return (
    <AppContext.Provider value={{ settings, setSettings, schedules, setSchedules, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

// Main Hook to Access Raw Context (internal use)
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// --------
// 📦 Custom Hooks (screens should mostly use these!)
// --------

export function useSettings() {
  const { settings, setSettings } = useAppContext();
  return {
    ...settings,
    setIsDarkMode: (value) => setSettings(prev => ({ ...prev, isDarkMode: value })),
    setIs24HourTime: (value) => setSettings(prev => ({ ...prev, is24HourTime: value })),
  };
}

export function useSchedules() {
  const { schedules, setSchedules } = useAppContext();
  return {
    ...schedules,
    addSchedule: (schedule) => setSchedules(prev => ({
      schedules: [...prev.schedules, schedule],
      activeScheduleId: schedule.id,
    })),
    deleteSchedule: (id) => setSchedules(prev => ({
      schedules: prev.schedules.filter(s => s.id !== id),
      activeScheduleId: prev.activeScheduleId === id ? null : prev.activeScheduleId,
    })),
    setActiveScheduleId: (id) => setSchedules(prev => ({ ...prev, activeScheduleId: id })),
    clearAllSchedules: () => setSchedules(initialSchedules),
  };
}

export function useUser() {
  const { user, setUser } = useAppContext();
  return {
    ...user,
    upgradeToPro: () => setUser(prev => ({ ...prev, isProUser: true })),
    downgradeToFree: () => setUser(prev => ({ ...prev, isProUser: false })),
  };
}
