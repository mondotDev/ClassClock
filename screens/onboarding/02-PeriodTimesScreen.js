// screens/onboarding/02-PeriodTimesScreen.js

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AppButton from '../../components/AppButton';

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const AMPM = ['AM', 'PM'];

export default function PeriodTimesScreen({ navigation, route }) {
  const { name, selectedDays, hasZero, count } = route.params;
  const periodCount = Number(count);
  const total = periodCount + (hasZero ? 1 : 0);

  const { showActionSheetWithOptions } = useActionSheet();

  const [periods, setPeriods] = useState(() =>
    Array.from({ length: total }, (_, i) => ({
      label: hasZero ? (i === 0 ? 'Zero' : `Period ${i}`) : `Period ${i + 1}`,
      startHour: '8',
      startMinute: '00',
      startAMPM: 'AM',
      endHour: '9',
      endMinute: '00',
      endAMPM: 'AM',
    }))
  );

  const handleChange = (idx, field, value) => {
    const updated = [...periods];
    updated[idx][field] = value;
    setPeriods(updated);
  };

  const openPicker = (idx, field, options) => {
    showActionSheetWithOptions(
      {
        options: [...options, 'Cancel'],
        cancelButtonIndex: options.length,
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== options.length) {
          handleChange(idx, field, options[selectedIndex]);
        }
      }
    );
  };

  const allFilled = periods.every(
    p => p.startHour && p.startMinute && p.startAMPM && p.endHour && p.endMinute && p.endAMPM
  );

  const handleNext = () => {
    const finalPeriods = periods.map(p => ({
      label: p.label,
      startTime: `${p.startHour}:${p.startMinute} ${p.startAMPM}`,
      endTime: `${p.endHour}:${p.endMinute} ${p.endAMPM}`,
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {periods.map((p, idx) => (
          <View key={idx} style={styles.periodCard}>
            <Text style={styles.periodLabel}>{p.label}</Text>

            <Text style={styles.sectionLabel}>Start Time</Text>
            <View style={styles.timeRow}>
              <TimeButton label={p.startHour} onPress={() => openPicker(idx, 'startHour', HOURS)} />
              <TimeButton label={p.startMinute} onPress={() => openPicker(idx, 'startMinute', MINUTES)} />
              <TimeButton label={p.startAMPM} onPress={() => openPicker(idx, 'startAMPM', AMPM)} />
            </View>

            <Text style={styles.sectionLabel}>End Time</Text>
            <View style={styles.timeRow}>
              <TimeButton label={p.endHour} onPress={() => openPicker(idx, 'endHour', HOURS)} />
              <TimeButton label={p.endMinute} onPress={() => openPicker(idx, 'endMinute', MINUTES)} />
              <TimeButton label={p.endAMPM} onPress={() => openPicker(idx, 'endAMPM', AMPM)} />
            </View>
          </View>
        ))}

        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!allFilled}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable button component
function TimeButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.timeButton} onPress={onPress}>
      <Text style={styles.timeButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodCard: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  periodLabel: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
