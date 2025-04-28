// screens/HomeScreen.js

import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CenteredView from '../components/CenteredView';
import useTheme from '../hooks/useTheme';
import { useSettings, useSchedules } from '../context/AppContext';
import { format, parse, differenceInMinutes, isBefore, isAfter } from 'date-fns';

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { is24HourTime } = useSettings();
  const { schedules, activeScheduleId } = useSchedules();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBlock, setCurrentBlock] = useState(null);
  const [minutesLeft, setMinutesLeft] = useState(null);

  const activeSchedule = schedules.find(s => s.id === activeScheduleId);

  useEffect(() => {
    updateTime();

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000;

    const timeoutId = setTimeout(() => {
      updateTime();
      intervalId = setInterval(updateTime, 60000);
    }, msUntilNextMinute);

    let intervalId;

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now);
    updateCurrentBlock(now);
  };

  const updateCurrentBlock = (now) => {
    if (!activeSchedule) {
      setCurrentBlock('No Schedule');
      setMinutesLeft(null);
      return;
    }

    const dayOfWeek = format(now, 'EEE');
    if (!activeSchedule.selectedDays.includes(dayOfWeek)) {
      setCurrentBlock('School Closed');
      setMinutesLeft(null);
      return;
    }

    const allBlocks = [];

    activeSchedule.periods.forEach(p => {
      allBlocks.push({
        label: p.label,
        start: parse(p.startTime, 'h:mm a', now),
        end: parse(p.endTime, 'h:mm a', now),
      });
    });

    if (activeSchedule.hasBreak) {
      allBlocks.push({
        label: 'Break',
        start: parse(activeSchedule.breakStartTime, 'h:mm a', now),
        end: parse(activeSchedule.breakEndTime, 'h:mm a', now),
      });
    }

    if (activeSchedule.hasLunch) {
      allBlocks.push({
        label: 'Lunch',
        start: parse(activeSchedule.lunchStartTime, 'h:mm a', now),
        end: parse(activeSchedule.lunchEndTime, 'h:mm a', now),
      });
    }

    allBlocks.sort((a, b) => a.start - b.start);

    let found = false;

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      if (isAfter(now, block.start) && isBefore(now, block.end)) {
        setCurrentBlock(block.label);
        setMinutesLeft(differenceInMinutes(block.end, now));
        found = true;
        break;
      }
      if (i < allBlocks.length - 1) {
        const nextBlock = allBlocks[i + 1];
        if (isAfter(now, block.end) && isBefore(now, nextBlock.start)) {
          setCurrentBlock('Passing Time');
          setMinutesLeft(differenceInMinutes(nextBlock.start, now));
          found = true;
          break;
        }
      }
    }

    if (!found) {
      if (isBefore(now, allBlocks[0].start)) {
        setCurrentBlock('Before School');
        setMinutesLeft(differenceInMinutes(allBlocks[0].start, now));
      } else if (isAfter(now, allBlocks[allBlocks.length - 1].end)) {
        setCurrentBlock('School Closed');
        setMinutesLeft(null);
      }
    }
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

  // Trigger pulse when minutesLeft changes
  useEffect(() => {
    if (minutesLeft !== null) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [minutesLeft]);

  const formattedTime = is24HourTime
    ? format(currentTime, 'HH:mm')
    : format(currentTime, 'hh:mm a');

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
            accessibilityLabel="Settings"
            accessibilityHint="Navigate to Settings Screen"
          >
            <Ionicons name="settings-outline" size={28} color={theme.colors.text} />
          </Pressable>
        </Animated.View>

        {/* Clock Card */}
        <View style={[styles.clockCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.timeText, { color: theme.colors.text }]}>
            {formattedTime}
          </Text>

          {currentBlock && (
            <Text style={[styles.periodText, { color: theme.colors.text }]}>
              {currentBlock}
            </Text>
          )}

          {minutesLeft !== null && (
            <Animated.Text style={[styles.countdownText, { color: theme.colors.text, opacity: fadeAnim }]}>
              {minutesLeft} min left
            </Animated.Text>
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
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  periodText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
