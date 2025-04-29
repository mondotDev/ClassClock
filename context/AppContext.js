// context/AppContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SchedulesContext = createContext();
const SettingsContext = createContext();

export function AppProvider({ children }) {
  const [schedules, setSchedules] = useState([]);
  const [activeScheduleId, setActiveScheduleId] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [is24HourTime, setIs24HourTime] = useState(false);
  const [isPro, setIsPro] = useState(true); // Default true for development
  const [schedulesLoaded, setSchedulesLoaded] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false); // 🔥 NEW

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSchedules = await AsyncStorage.getItem('@schedules');
        const storedActiveId = await AsyncStorage.getItem('@activeScheduleId');
        const storedDark = await AsyncStorage.getItem('@isDarkMode');
        const stored24 = await AsyncStorage.getItem('@is24HourTime');
        const storedHasOnboarded = await AsyncStorage.getItem('@hasOnboarded'); // 🔥

        if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
        if (storedActiveId) setActiveScheduleId(storedActiveId);
        if (storedDark) setIsDarkMode(storedDark === 'true');
        if (stored24) setIs24HourTime(stored24 === 'true');
        if (storedHasOnboarded) setHasOnboarded(storedHasOnboarded === 'true'); // 🔥
      } catch (e) {
        console.error('Failed to load app data', e);
      } finally {
        setSchedulesLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (schedulesLoaded) {
      AsyncStorage.setItem('@schedules', JSON.stringify(schedules));
    }
  }, [schedules, schedulesLoaded]);

  useEffect(() => {
    if (schedulesLoaded && activeScheduleId !== null) {
      AsyncStorage.setItem('@activeScheduleId', activeScheduleId);
    }
  }, [activeScheduleId, schedulesLoaded]);

  useEffect(() => {
    if (schedulesLoaded) {
      AsyncStorage.setItem('@isDarkMode', isDarkMode.toString());
    }
  }, [isDarkMode, schedulesLoaded]);

  useEffect(() => {
    if (schedulesLoaded) {
      AsyncStorage.setItem('@is24HourTime', is24HourTime.toString());
    }
  }, [is24HourTime, schedulesLoaded]);

  const addSchedule = (newSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
    setActiveScheduleId(newSchedule.id);
    setHasOnboarded(true); // 🔥 Automatically mark user as onboarded
    AsyncStorage.setItem('@hasOnboarded', 'true'); // 🔥 Persist it immediately
  };

  const deleteSchedule = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (id === activeScheduleId) {
      setActiveScheduleId(null);
    }
  };

  const updateSchedule = (updated) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setActiveScheduleId(updated.id);
  };

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        schedulesLoaded,
        activeScheduleId,
        addSchedule,
        deleteSchedule,
        updateSchedule,
        setActiveScheduleId,
        isPro,
        setIsPro,
        hasOnboarded,
        setHasOnboarded,
      }}
    >
      <SettingsContext.Provider
        value={{
          isDarkMode,
          setIsDarkMode,
          is24HourTime,
          setIs24HourTime,
        }}
      >
        {children}
      </SettingsContext.Provider>
    </SchedulesContext.Provider>
  );
}

export const useSchedules = () => useContext(SchedulesContext);
export const useSettings = () => useContext(SettingsContext);
