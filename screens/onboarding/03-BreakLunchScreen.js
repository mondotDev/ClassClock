// screens/onboarding/03-BreakLunchScreen.js

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Checkbox from 'expo-checkbox';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const AMPM = ['AM', 'PM'];

export default function BreakLunchScreen({ navigation, route }) {
  const { name, selectedDays, hasZero, count, periods } = route.params;
  const { colors } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const [hasBreak, setHasBreak] = useState(false);
  const [breakStart, setBreakStart] = useState({ hour: '10', minute: '00', ampm: 'AM' });
  const [breakEnd, setBreakEnd] = useState({ hour: '10', minute: '15', ampm: 'AM' });

  const [hasLunch, setHasLunch] = useState(false);
  const [lunchStart, setLunchStart] = useState({ hour: '12', minute: '00', ampm: 'PM' });
  const [lunchEnd, setLunchEnd] = useState({ hour: '12', minute: '30', ampm: 'PM' });

  const openPicker = (setter, field, options) => {
    showActionSheetWithOptions(
      {
        options: [...options, 'Cancel'],
        cancelButtonIndex: options.length,
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== options.length) {
          setter(prev => ({ ...prev, [field]: options[selectedIndex] }));
        }
      }
    );
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
      breakStartTime: `${breakStart.hour}:${breakStart.minute} ${breakStart.ampm}`,
      breakEndTime: `${breakEnd.hour}:${breakEnd.minute} ${breakEnd.ampm}`,
      hasLunch,
      lunchStartTime: `${lunchStart.hour}:${lunchStart.minute} ${lunchStart.ampm}`,
      lunchEndTime: `${lunchEnd.hour}:${lunchEnd.minute} ${lunchEnd.ampm}`,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
            <>
              <Text style={[styles.subLabel, { color: colors.text, marginTop: 16 }]}>Break Start Time</Text>
              <View style={styles.timeRow}>
                <TimeButton label={breakStart.hour} onPress={() => openPicker(setBreakStart, 'hour', HOURS)} />
                <TimeButton label={breakStart.minute} onPress={() => openPicker(setBreakStart, 'minute', MINUTES)} />
                <TimeButton label={breakStart.ampm} onPress={() => openPicker(setBreakStart, 'ampm', AMPM)} />
              </View>

              <Text style={[styles.subLabel, { color: colors.text, marginTop: 16 }]}>Break End Time</Text>
              <View style={styles.timeRow}>
                <TimeButton label={breakEnd.hour} onPress={() => openPicker(setBreakEnd, 'hour', HOURS)} />
                <TimeButton label={breakEnd.minute} onPress={() => openPicker(setBreakEnd, 'minute', MINUTES)} />
                <TimeButton label={breakEnd.ampm} onPress={() => openPicker(setBreakEnd, 'ampm', AMPM)} />
              </View>
            </>
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
            <>
              <Text style={[styles.subLabel, { color: colors.text, marginTop: 16 }]}>Lunch Start Time</Text>
              <View style={styles.timeRow}>
                <TimeButton label={lunchStart.hour} onPress={() => openPicker(setLunchStart, 'hour', HOURS)} />
                <TimeButton label={lunchStart.minute} onPress={() => openPicker(setLunchStart, 'minute', MINUTES)} />
                <TimeButton label={lunchStart.ampm} onPress={() => openPicker(setLunchStart, 'ampm', AMPM)} />
              </View>

              <Text style={[styles.subLabel, { color: colors.text, marginTop: 16 }]}>Lunch End Time</Text>
              <View style={styles.timeRow}>
                <TimeButton label={lunchEnd.hour} onPress={() => openPicker(setLunchEnd, 'hour', HOURS)} />
                <TimeButton label={lunchEnd.minute} onPress={() => openPicker(setLunchEnd, 'minute', MINUTES)} />
                <TimeButton label={lunchEnd.ampm} onPress={() => openPicker(setLunchEnd, 'ampm', AMPM)} />
              </View>
            </>
          )}
        </View>

        {/* Next Button */}
        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!allValid}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function TimeButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.timeButton} onPress={onPress}>
      <Text style={styles.timeButtonText}>{label}</Text>
    </TouchableOpacity>
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
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
