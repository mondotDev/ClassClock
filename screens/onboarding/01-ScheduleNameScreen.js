// screens/onboarding/01-ScheduleNameScreen.js

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleNameScreen({ navigation }) {
  const theme = useTheme();
  const [scheduleName, setScheduleName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [hasZeroPeriod, setHasZeroPeriod] = useState(false);
  const [numberOfPeriods, setNumberOfPeriods] = useState('');

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    navigation.navigate('PeriodTimes', {
      name: scheduleName.trim() || 'Regular',
      selectedDays,
      hasZero: hasZeroPeriod,
      count: numberOfPeriods,
    });
  };

  const isFormValid = selectedDays.length > 0 && numberOfPeriods !== '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Schedule Name Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Schedule Name</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="e.g. Regular Schedule"
            placeholderTextColor={theme.colors.border}
            value={scheduleName}
            onChangeText={setScheduleName}
          />
        </View>

        {/* Days Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Days This Schedule Applies:</Text>
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <View key={day} style={styles.dayItem}>
                <Checkbox
                  value={selectedDays.includes(day)}
                  onValueChange={() => toggleDay(day)}
                  color={selectedDays.includes(day) ? theme.colors.primary : undefined}
                />
                <Text style={[styles.dayLabel, { color: theme.colors.text }]}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Zero Period and Number of Periods Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Include Zero Period?</Text>
            <Checkbox
              value={hasZeroPeriod}
              onValueChange={setHasZeroPeriod}
              color={hasZeroPeriod ? theme.colors.primary : undefined}
            />
          </View>

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Number of Periods:</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Enter number of periods"
            placeholderTextColor={theme.colors.border}
            keyboardType="numeric"
            value={numberOfPeriods}
            onChangeText={setNumberOfPeriods}
          />
        </View>

        {/* Next Button */}
        <AppButton
          title="Next"
          onPress={handleNext}
          disabled={!isFormValid}
          style={{ marginTop: 32 }}
        />
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
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  dayLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
