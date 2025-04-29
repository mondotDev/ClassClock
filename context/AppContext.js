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
  const [isPro, setIsPro] = useState(true); // 🔥 You can default to false if you want to simulate free user

  useEffect(() => {
    const loadData = async () => {
      const storedSchedules = await AsyncStorage.getItem('@schedules');
      const storedActiveId = await AsyncStorage.getItem('@activeScheduleId');
      const storedDark = await AsyncStorage.getItem('@isDarkMode');
      const stored24 = await AsyncStorage.getItem('@is24HourTime');

      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
      if (storedActiveId) setActiveScheduleId(storedActiveId);
      if (storedDark) setIsDarkMode(storedDark === 'true');
      if (stored24) setIs24HourTime(stored24 === 'true');
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    if (activeScheduleId !== null) {
      AsyncStorage.setItem('@activeScheduleId', activeScheduleId);
    }
  }, [activeScheduleId]);

  useEffect(() => {
    AsyncStorage.setItem('@isDarkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    AsyncStorage.setItem('@is24HourTime', is24HourTime.toString());
  }, [is24HourTime]);

  const addSchedule = (newSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
    setActiveScheduleId(newSchedule.id);
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
        activeScheduleId,
        addSchedule,
        deleteSchedule,
        updateSchedule,
        setActiveScheduleId,
        isPro,
        setIsPro, // now you can change it dynamically later
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
