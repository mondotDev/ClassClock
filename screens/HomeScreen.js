// screens/HomeScreen.js

import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CenteredView from '../components/CenteredView';
import useTheme from '../hooks/useTheme';
import { useSettings, useSchedules } from '../context/AppContext';
import { format } from 'date-fns';

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { is24HourTime } = useSettings();
  const { schedules, schedulesLoaded, hasOnboarded } = useSchedules();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [currentBlock, setCurrentBlock] = useState('Loading...');
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    if (schedulesLoaded && schedules.length === 0 && !hasOnboarded) {
      const timeout = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ScheduleName' }],
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [schedules, schedulesLoaded, hasOnboarded]);

  useEffect(() => {
    updateTime();

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      setUpdater(interval);
    }, msUntilNextMinute);

    let updater;
    function setUpdater(interval) {
      updater = interval;
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(updater);
    };
  }, []);

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now);
    findActiveSchedule(now);
  };

  const findActiveSchedule = (now) => {
    const today = format(now, 'EEE'); // "Mon", "Tue", etc.

    const matchingSchedule = schedules.find(
      (s) => Array.isArray(s.selectedDays) && s.selectedDays.includes(today)
    );

    if (matchingSchedule) {
      setActiveSchedule(matchingSchedule);
      updateCurrentBlock(now, matchingSchedule);
    } else {
      setActiveSchedule(null);
      setCurrentBlock('No Schedule Listed');
      setMinutesLeft(null);
    }
  };

  const updateCurrentBlock = (now, schedule) => {
    if (!schedule) {
      setCurrentBlock('No Schedule Listed');
      setMinutesLeft(null);
      return;
    }

    const allBlocks = [];

    schedule.periods.forEach((p) => {
      allBlocks.push({
        label: p.label,
        start: parseTime(p.startTime, now),
        end: parseTime(p.endTime, now),
      });
    });

    if (schedule.hasBreak) {
      allBlocks.push({
        label: 'Break',
        start: parseTime(schedule.breakStartTime, now),
        end: parseTime(schedule.breakEndTime, now),
      });
    }

    if (schedule.hasLunch) {
      allBlocks.push({
        label: 'Lunch',
        start: parseTime(schedule.lunchStartTime, now),
        end: parseTime(schedule.lunchEndTime, now),
      });
    }

    allBlocks.sort((a, b) => a.start - b.start);

    let found = false;

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      if (now >= block.start && now < block.end) {
        setCurrentBlock(block.label);
        setMinutesLeft(Math.floor((block.end - now) / (1000 * 60)));
        found = true;
        break;
      }
      if (i < allBlocks.length - 1) {
        const nextBlock = allBlocks[i + 1];
        if (now >= block.end && now < nextBlock.start) {
          setCurrentBlock('Passing Time');
          setMinutesLeft(Math.floor((nextBlock.start - now) / (1000 * 60)));
          found = true;
          break;
        }
      }
    }

    if (!found) {
      if (now < allBlocks[0].start) {
        setCurrentBlock('Before School');
        setMinutesLeft(Math.floor((allBlocks[0].start - now) / (1000 * 60)));
      } else if (now > allBlocks[allBlocks.length - 1].end) {
        setCurrentBlock('School Closed');
        setMinutesLeft(null);
      }
    }
  };

  const parseTime = (timeStr, referenceDate) => {
    const [time, ampm] = timeStr.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    const newDate = new Date(referenceDate);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const formattedTime = is24HourTime
    ? format(currentTime, 'HH:mm')
    : format(currentTime, 'hh:mm a');

  const formattedDate = format(currentTime, 'EEEE, MMMM d');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CenteredView style={{ padding: 24 }}>
        {/* Cogwheel Button */}
        <Animated.View style={[styles.cogButton, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.pressableArea,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="settings-outline" size={28} color={theme.colors.text} />
          </Pressable>
        </Animated.View>

        {/* Time Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.timeText, { color: theme.colors.text }]}>{formattedTime}</Text>
          <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
        </View>

        {/* Period Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.periodText, { color: theme.colors.text }]}>{currentBlock}</Text>
          {minutesLeft !== null && (
            <Text style={[styles.countdownText, { color: theme.colors.text }]}>
              {minutesLeft} min left
            </Text>
          )}
        </View>
      </CenteredView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cogButton: {
    position: 'absolute',
    top: 48,
    right: 16,
  },
  pressableArea: {
    padding: 8,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    opacity: 0.8,
  },
  periodText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 18,
    opacity: 0.7,
  },
});
