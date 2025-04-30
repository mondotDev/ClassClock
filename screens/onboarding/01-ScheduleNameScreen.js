// screens/onboarding/ScheduleNameScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import { useSchedules } from '../../context/AppContext';
import useTheme from '../../hooks/useTheme';
import Toast from 'react-native-toast-message';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weekends = ['Sat', 'Sun'];

export default function ScheduleNameScreen({ route }) {
  const { params } = route || {};
  const {
    scheduleName: initialName = '',
    selectedDays: initialDays = [],
    hasZeroPeriod: initialZero = false,
    numPeriods: initialPeriods = 6,
    edit = false,
    existingSchedule = null,
  } = params || {};

  const [scheduleName, setScheduleName] = useState(initialName);
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [hasZeroPeriod, setHasZeroPeriod] = useState(initialZero);
  const [numPeriods, setNumPeriods] = useState(initialPeriods);

  const navigation = useNavigation();
  const theme = useTheme();
  const { schedules } = useSchedules();

  useEffect(() => {
    if (edit && !existingSchedule) {
      Toast.show({
        type: 'error',
        text1: 'Schedule not found',
        text2: 'Returning to Home screen.',
        position: 'top',
      });
      navigation.replace('Home');
    }
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const incrementPeriods = () => {
    if (numPeriods < 12) setNumPeriods((prev) => prev + 1);
  };

  const decrementPeriods = () => {
    if (numPeriods > 1) setNumPeriods((prev) => prev - 1);
  };

  const handleNext = () => {
    const trimmedName = scheduleName.trim();
    if (!trimmedName) {
      Toast.show({
        type: 'error',
        text1: 'Missing Name',
        text2: 'Please enter a schedule name.',
        position: 'top',
      });
      return;
    }

    if (!edit) {
      const duplicate = schedules.some(
        (s) => s.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (duplicate) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate Name',
          text2: 'A schedule with that name already exists.',
          position: 'top',
        });
        return;
      }
    }

    if (selectedDays.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Select Days',
        text2: 'Please select at least one day for this schedule.',
        position: 'top',
      });
      return;
    }

    navigation.navigate('PeriodTimes', {
      scheduleName: trimmedName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      edit,
      existingSchedule,
    });
  };

  const renderChip = (day) => (
    <Pressable
      key={day}
      onPress={() => toggleDay(day)}
      style={[
        styles.chip,
        {
          backgroundColor: selectedDays.includes(day)
            ? theme.colors.primary
            : theme.colors.card,
        },
      ]}
    >
      <Text
        style={{
          color: selectedDays.includes(day) ? 'white' : theme.colors.text,
          fontWeight: '600',
        }}
      >
        {day}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Name Your Schedule</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          value={scheduleName}
          onChangeText={setScheduleName}
          placeholder="Enter schedule name"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Days</Text>
        <View style={styles.chipRow}>{weekdays.map(renderChip)}</View>
        <View style={styles.chipRow}>{weekends.map(renderChip)}</View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Zero Period</Text>
          <Switch
            value={hasZeroPeriod}
            onValueChange={setHasZeroPeriod}
            thumbColor={hasZeroPeriod ? theme.colors.primary : '#ccc'}
          />
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Periods: {numPeriods}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={[styles.stepButton, { backgroundColor: theme.colors.card }]}
              onPress={decrementPeriods}
            >
              <Text style={[styles.stepText, { color: theme.colors.text }]}>-</Text>
            </Pressable>
            <Pressable
              style={[styles.stepButton, { backgroundColor: theme.colors.card }]}
              onPress={incrementPeriods}
            >
              <Text style={[styles.stepText, { color: theme.colors.text }]}>+</Text>
            </Pressable>
          </View>
        </View>

        <AppButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
  },
  stepper: {
    flexDirection: 'row',
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  stepText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
