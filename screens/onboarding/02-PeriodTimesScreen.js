// screens/onboarding/02-PeriodTimesScreen.js

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';

export default function PeriodTimesScreen({ navigation, route }) {
  const { name, selectedDays, hasZero, count } = route.params;
  const periodCount = Number(count);
  const total = periodCount + (hasZero ? 1 : 0);

  const { colors } = useTheme();

  const [periods, setPeriods] = useState(() =>
    Array.from({ length: total }, (_, i) => ({
      label: hasZero ? (i === 0 ? 'Zero Period' : `Period ${i}`) : `Period ${i + 1}`,
      startTime: new Date(),
      endTime: new Date(),
    }))
  );

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: 'time',
    field: null, // { idx, type: 'start' or 'end' }
  });

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

  const openTimePicker = (idx, type) => {
    setPickerState({
      isVisible: true,
      mode: 'time',
      field: { idx, type },
    });
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
      name,
      selectedDays,
      hasZero,
      count,
      periods: finalPeriods,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {periods.map((p, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.periodLabel, { color: colors.text }]}>
              {hasZero && idx === 0 ? "Zero Period" : `Period ${hasZero ? idx : idx + 1}`}
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
  periodLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
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
