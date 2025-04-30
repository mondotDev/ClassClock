// screens/onboarding/02-PeriodTimesScreen.js

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';

export default function PeriodTimesScreen({ navigation, route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    edit = false,
    existingSchedule = null,
  } = route.params;

  const { colors } = useTheme();
  const total = numPeriods + (hasZeroPeriod ? 1 : 0);

  const generateDefaultPeriods = () => {
    const base = new Date();
    base.setHours(8, 30, 0, 0); // Start at 8:30 AM

    return Array.from({ length: total }, (_, i) => {
      const start = new Date(base.getTime() + i * 50 * 60000);
      const end = new Date(start.getTime() + 50 * 60000);
      return {
        label: hasZeroPeriod && i === 0 ? 'Zero Period' : `Period ${hasZeroPeriod ? i : i + 1}`,
        startTime: start,
        endTime: end,
      };
    });
  };

  const [periods, setPeriods] = useState(() => {
    if (edit && existingSchedule?.periods?.length) {
      return existingSchedule.periods.map((p, i) => ({
        label: p.label || (hasZeroPeriod && i === 0 ? 'Zero Period' : `Period ${i + 1}`),
        startTime: parseTime(p.startTime),
        endTime: parseTime(p.endTime),
      }));
    } else {
      return generateDefaultPeriods();
    }
  });

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: 'time',
    field: null,
  });

  const openTimePicker = (idx, type) => {
    setPickerState({
      isVisible: true,
      mode: 'time',
      field: { idx, type },
    });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime) {
      setPickerState({ isVisible: false, mode: 'time', field: null });
      return;
    }

    const { idx, type } = pickerState.field;
    const updated = [...periods];
    updated[idx][type === 'start' ? 'startTime' : 'endTime'] = selectedTime;
    setPeriods(updated);
    setPickerState({ isVisible: false, mode: 'time', field: null });
  };

  const handleLabelChange = (idx, text) => {
    const updated = [...periods];
    updated[idx].label = text;
    setPeriods(updated);
  };

  const allFilled = periods.every(p => p.startTime && p.endTime && p.label.trim().length > 0);

  const handleNext = () => {
    const finalPeriods = periods.map(p => ({
      label: p.label,
      startTime: format(p.startTime, 'h:mm a'),
      endTime: format(p.endTime, 'h:mm a'),
    }));

    navigation.navigate('BreakLunch', {
      scheduleName,           // ✅ Fixed
      selectedDays,
      hasZeroPeriod,          // ✅ Fixed
      numPeriods,             // ✅ Fixed
      periods: finalPeriods,
      edit,
      existingSchedule,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {periods.map((p, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.periodLabel, { color: colors.text }]}>
              {p.label}
            </Text>

            <TextInput
              value={p.label}
              onChangeText={text => handleLabelChange(idx, text)}
              placeholder="Enter Class Name"
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholderTextColor={colors.border}
            />

            <View style={styles.timeRow}>
              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker(idx, 'start')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>
                  Start: {format(p.startTime, 'h:mm a')}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.timeButton, { backgroundColor: colors.primary }]}
                onPress={() => openTimePicker(idx, 'end')}
              >
                <Text style={[styles.timeButtonText, { color: colors.background }]}>
                  End: {format(p.endTime, 'h:mm a')}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!allFilled}
          style={{ marginTop: 32 }}
        />

        {pickerState.isVisible && (
          <DateTimePicker
            value={
              pickerState.field?.type === 'start'
                ? periods[pickerState.field.idx].startTime
                : periods[pickerState.field.idx].endTime
            }
            mode="time"
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
    paddingBottom: 48,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 36,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  periodLabel: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  timeButton: {
    flexBasis: '48%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
