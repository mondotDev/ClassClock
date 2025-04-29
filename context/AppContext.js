import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEDULES_KEY = '@schedules';
const SETTINGS_KEY = '@settings';

// --- SETTINGS CONTEXT --- //
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [is24HourTime, setIs24HourTime] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setIsDarkMode(parsed.isDarkMode ?? false);
          setIs24HourTime(parsed.is24HourTime ?? false);
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ isDarkMode, is24HourTime }));
      } catch (e) {
        console.warn('Failed to save settings:', e);
      }
    };
    save();
  }, [isDarkMode, is24HourTime, loaded]);

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={{ isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

// --- SCHEDULES CONTEXT --- //
const SchedulesContext = createContext();

export const SchedulesProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [activeScheduleId, setActiveScheduleId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const saved = await AsyncStorage.getItem(SCHEDULES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSchedules(parsed.schedules ?? []);
          setActiveScheduleId(parsed.activeScheduleId ?? null);
        }
      } catch (e) {
        console.warn('Failed to load schedules:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadSchedules();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(SCHEDULES_KEY, JSON.stringify({ schedules, activeScheduleId }));
      } catch (e) {
        console.warn('Failed to save schedules:', e);
      }
    };
    save();
  }, [schedules, activeScheduleId, loaded]);

  const addSchedule = (schedule) => {
    setSchedules(prev => [...prev, schedule]);
    setActiveScheduleId(schedule.id);
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    if (id === activeScheduleId) {
      setActiveScheduleId(null);
    }
  };

  if (!loaded) return null;

  return (
    <SchedulesContext.Provider value={{ schedules, addSchedule, deleteSchedule, activeScheduleId, setActiveScheduleId }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);

// --- COMBINED PROVIDER --- //
export const AppProvider = ({ children }) => (
  <SettingsProvider>
    <SchedulesProvider>
      {children}
    </SchedulesProvider>
  </SettingsProvider>
);
