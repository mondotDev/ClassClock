// screens/onboarding/04-ReviewScheduleScreen.js

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSchedules } from '../../context/AppContext';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';

export default function ReviewScheduleScreen({ route, navigation }) {
  const { addSchedule, updateSchedule } = useSchedules();
  const { colors } = useTheme();

  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    periods,
    hasBreak,
    breakStartTime,
    breakEndTime,
    hasLunch,
    lunchStartTime,
    lunchEndTime,
    edit = false,
    existingSchedule = null,
  } = route.params || {};

  if (!scheduleName || !Array.isArray(periods)) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>No schedule found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    const newSchedule = {
      id: edit && existingSchedule ? existingSchedule.id : Date.now().toString(),
      name: scheduleName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      periods,
      hasBreak,
      breakStartTime,
      breakEndTime,
      hasLunch,
      lunchStartTime,
      lunchEndTime,
    };

    if (edit && existingSchedule) {
      updateSchedule(newSchedule);
    } else {
      addSchedule(newSchedule);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Review Your Schedule</Text>

        <Text style={[styles.label, { color: colors.text }]}>Schedule Name:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{scheduleName}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Days:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{selectedDays.join(', ')}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Periods:</Text>
        {periods.map((p, i) => (
          <Text key={i} style={[styles.value, { color: colors.text }]}>
            {p.label || `Period ${i + 1}`}: {p.startTime} - {p.endTime}
          </Text>
        ))}

        {hasBreak && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Break:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {breakStartTime} – {breakEndTime}
            </Text>
          </>
        )}

        {hasLunch && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Lunch:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {lunchStartTime} – {lunchEndTime}
            </Text>
          </>
        )}

        <AppButton title={edit ? 'Update Schedule' : 'Save Schedule'} onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
