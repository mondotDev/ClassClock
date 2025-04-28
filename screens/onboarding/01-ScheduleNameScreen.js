// screens/onboarding/01-ScheduleNameScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

import CenteredView from '../../components/CenteredView';
import AppButton from '../../components/AppButton';

export default function ScheduleNameScreen() {
  const navigation = useNavigation();

  const [scheduleName, setScheduleName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [hasZeroPeriod, setHasZeroPeriod] = useState(false);
  const [periodCount, setPeriodCount] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function toggleDay(day) {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  function handleNext() {
    navigation.navigate('PeriodTimes', {
      name: scheduleName,
      selectedDays,
      hasZero: hasZeroPeriod,
      count: periodCount,
    });
  }

  return (
    <CenteredView>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        {/* Schedule Name */}
        <Text style={styles.label}>Schedule Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Regular Schedule"
          value={scheduleName}
          onChangeText={setScheduleName}
        />

        {/* Days */}
        <Text style={styles.label}>Days This Schedule Applies:</Text>
        <View style={styles.daysGrid}>
          {daysOfWeek.map((day, idx) => (
            <View key={idx} style={styles.dayRow}>
              <Checkbox
                value={selectedDays.includes(day)}
                onValueChange={() => toggleDay(day)}
              />
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Zero Period Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Include Zero Period?</Text>
          <Checkbox
            value={hasZeroPeriod}
            onValueChange={setHasZeroPeriod}
          />
        </View>

        {/* Period Count */}
        <Text style={styles.label}>Number of Periods:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of periods"
          keyboardType="number-pad"
          value={periodCount ? periodCount.toString() : ''}
          onChangeText={text => setPeriodCount(parseInt(text) || null)}
        />

        {/* Next Button */}
        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!scheduleName || selectedDays.length === 0 || !periodCount}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginVertical: 4,
  },
  dayLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
});
