// screens/onboarding/ReviewScheduleScreen.js

import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSchedules } from '../../context/AppContext';

export default function ReviewScheduleScreen({ navigation, route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    periods,
    hasBreak,
    hasLunch,
    breakStartTime,
    breakEndTime,
    lunchStartTime,
    lunchEndTime,
    edit = false,
    existingSchedule = null,
  } = route.params;

  const theme = useTheme();
  const nav = useNavigation();
  const { addSchedule, updateSchedule } = useSchedules();

  useEffect(() => {
    if (edit && !existingSchedule) {
      Toast.show({
        type: 'error',
        text1: 'Schedule not found',
        text2: 'Returning to Home screen.',
        position: 'top',
      });
      nav.replace('Home');
    }
  }, []);

  const handleFinish = () => {
    const newSchedule = {
      id: existingSchedule?.id ?? Date.now().toString(),
      name: scheduleName ?? '',
      selectedDays: Array.isArray(selectedDays) ? selectedDays : [],
      hasZeroPeriod: !!hasZeroPeriod,
      numPeriods: typeof numPeriods === 'number' ? numPeriods : 0,
      periods: Array.isArray(periods) ? periods : [],
      hasBreak: !!hasBreak,
      hasLunch: !!hasLunch,
      breakStartTime: breakStartTime || '',
      breakEndTime: breakEndTime || '',
      lunchStartTime: lunchStartTime || '',
      lunchEndTime: lunchEndTime || '',
    };

    if (edit && existingSchedule) {
      updateSchedule(newSchedule);
    } else {
      addSchedule(newSchedule);
    }

    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>
          Review Your Schedule
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Name: <Text style={styles.value}>{scheduleName}</Text>
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Days: <Text style={styles.value}>{(selectedDays || []).join(', ')}</Text>
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Zero Period: <Text style={styles.value}>{hasZeroPeriod ? 'Yes' : 'No'}</Text>
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Number of Periods: <Text style={styles.value}>{numPeriods}</Text>
        </Text>

        {(periods || []).map((p, idx) => (
          <View key={idx} style={styles.periodCard}>
            <Text style={[styles.periodTitle, { color: theme.colors.text }]}>
              {p.label}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              {p.startTime} – {p.endTime}
            </Text>
          </View>
        ))}

        {hasBreak && (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Break: <Text style={styles.value}>{breakStartTime} – {breakEndTime}</Text>
          </Text>
        )}

        {hasLunch && (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Lunch: <Text style={styles.value}>{lunchStartTime} – {lunchEndTime}</Text>
          </Text>
        )}

        <AppButton title="Finish" onPress={handleFinish} style={{ marginTop: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 64,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontWeight: '400',
  },
  periodCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
