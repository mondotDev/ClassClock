// screens/onboarding/03-BreakLunchScreen.js

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';

export default function BreakLunchScreen({ navigation, route }) {
  const { name, selectedDays, hasZero, count, periods, edit = false, existingSchedule = null } = route.params;
  const { colors } = useTheme();

  const [hasBreak, setHasBreak] = useState(false);
  const [breakStart, setBreakStart] = useState(new Date());
  const [breakEnd, setBreakEnd] = useState(new Date());

  const [hasLunch, setHasLunch] = useState(false);
  const [lunchStart, setLunchStart] = useState(new Date());
  const [lunchEnd, setLunchEnd] = useState(new Date());

  useEffect(() => {
    if (edit && existingSchedule) {
      setHasBreak(existingSchedule.hasBreak ?? false);
      setHasLunch(existingSchedule.hasLunch ?? false);

      if (existingSchedule.hasBreak) {
        setBreakStart(parseTime(existingSchedule.breakStartTime));
        setBreakEnd(parseTime(existingSchedule.breakEndTime));
      }
      if (existingSchedule.hasLunch) {
        setLunchStart(parseTime(existingSchedule.lunchStartTime));
        setLunchEnd(parseTime(existingSchedule.lunchEndTime));
      }
    }
  }, [edit, existingSchedule]);

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: 'time',
    target: null,
  });

  const openTimePicker = (target) => {
    setPickerState({
      isVisible: true,
      mode: 'time',
      target,
    });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime) {
      setPickerState({ isVisible: false, mode: 'time', target: null });
      return;
    }

    switch (pickerState.target) {
      case 'breakStart':
        setBreakStart(selectedTime);
        break;
      case 'breakEnd':
        setBreakEnd(selectedTime);
        break;
      case 'lunchStart':
        setLunchStart(selectedTime);
        break;
      case 'lunchEnd':
        setLunchEnd(selectedTime);
        break;
    }

    setPickerState({ isVisible: false, mode: 'time', target: null });
  };

  const allValid = (!hasBreak || (breakStart && breakEnd)) && (!hasLunch || (lunchStart && lunchEnd));

  const handleNext = () => {
    navigation.navigate('ReviewSchedule', {
      name,
      selectedDays,
      hasZero,
      count,
      periods,
      hasBreak,
      breakStartTime: format(breakStart, 'h:mm a'),
      breakEndTime: format(breakEnd, 'h:mm a'),
      hasLunch,
      lunchStartTime: format(lunchStart, 'h:mm a'),
      lunchEndTime: format(lunchEnd, 'h:mm a'),
      edit,
      existingSchedule,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Break Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Include Break?</Text>
            <Checkbox
              value={hasBreak}
              onValueChange={setHasBreak}
              color={hasBreak ? colors.primary : undefined}
            />
          </View>

          {hasBreak && (
            <View style={styles.timeRow}>
              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker('breakStart')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>  
                  Break Start: {format(breakStart, 'h:mm a')}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker('breakEnd')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>  
                  Break End: {format(breakEnd, 'h:mm a')}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Lunch Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Include Lunch?</Text>
            <Checkbox
              value={hasLunch}
              onValueChange={setHasLunch}
              color={hasLunch ? colors.primary : undefined}
            />
          </View>

          {hasLunch && (
            <View style={styles.timeRow}>
              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker('lunchStart')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>  
                  Lunch Start: {format(lunchStart, 'h:mm a')}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker('lunchEnd')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>  
                  Lunch End: {format(lunchEnd, 'h:mm a')}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!allValid}
          style={{ marginTop: 32 }}
        />

        {pickerState.isVisible && (
          <DateTimePicker
            value={
              pickerState.target === 'breakStart' ? breakStart :
              pickerState.target === 'breakEnd' ? breakEnd :
              pickerState.target === 'lunchStart' ? lunchStart :
              lunchEnd
            }
            mode={pickerState.mode}
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function parseTime(timeString) {
  try {
    const [time, ampm] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  } catch (e) {
    return new Date();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    padding: 24,
    alignItems: 'stretch',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
