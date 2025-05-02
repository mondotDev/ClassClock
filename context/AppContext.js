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
  const [isPro, setIsPro] = useState(true);
  const [schedulesLoaded, setSchedulesLoaded] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSchedules = await AsyncStorage.getItem('@schedules');
        const storedActiveId = await AsyncStorage.getItem('@activeScheduleId');
        const storedDark = await AsyncStorage.getItem('@isDarkMode');
        const stored24 = await AsyncStorage.getItem('@is24HourTime');
        const storedHasOnboarded = await AsyncStorage.getItem('@hasOnboarded');

        if (storedSchedules) {
          const parsed = JSON.parse(storedSchedules);
          const validSchedules = parsed.filter(
            s => s && Array.isArray(s.selectedDays) && s.selectedDays.length > 0
          );
          setSchedules(validSchedules);
        }

        if (storedActiveId) setActiveScheduleId(storedActiveId);
        if (storedDark) setIsDarkMode(storedDark === 'true');
        if (stored24) setIs24HourTime(stored24 === 'true');
        if (storedHasOnboarded) setHasOnboarded(storedHasOnboarded === 'true');
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

  useEffect(() => {
    if (schedulesLoaded && schedules.length === 0) {
      setActiveScheduleId(null);
    }
  }, [schedules, schedulesLoaded]);

  const addSchedule = (newSchedule) => {
    if (!newSchedule.selectedDays || !Array.isArray(newSchedule.selectedDays) || newSchedule.selectedDays.length === 0) {
      console.warn('❌ Invalid schedule attempted:', newSchedule);
      return;
    }

    setSchedules(prev => [...prev, newSchedule]);
    setActiveScheduleId(newSchedule.id);
    setHasOnboarded(true);
    AsyncStorage.setItem('@hasOnboarded', 'true');
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    if (id === activeScheduleId) {
      setActiveScheduleId(null);
    }
  };

  const updateSchedule = (updated) => {
    setSchedules(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    setActiveScheduleId(updated.id);
  };

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        setSchedules, // ✅ Exposed for reset logic
        schedulesLoaded,
        activeScheduleId,
        setActiveScheduleId,
        addSchedule,
        deleteSchedule,
        updateSchedule,
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
