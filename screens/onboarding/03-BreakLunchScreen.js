import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Switch, Platform } from 'react-native';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BreakLunchScreen({ navigation, route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    periods,
    edit = false,
    existingSchedule = null,
  } = route.params;

  const { colors } = useTheme();

  const [hasBreak, setHasBreak] = useState(false);
  const [hasLunch, setHasLunch] = useState(false);

  const [breakStartTime, setBreakStartTime] = useState(new Date());
  const [breakEndTime, setBreakEndTime] = useState(new Date());
  const [lunchStartTime, setLunchStartTime] = useState(new Date());
  const [lunchEndTime, setLunchEndTime] = useState(new Date());

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: 'time',
    field: null,
  });

  const openTimePicker = (field) => {
    setPickerState({
      isVisible: true,
      mode: 'time',
      field,
    });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime) {
      setPickerState({ isVisible: false, mode: 'time', field: null });
      return;
    }

    switch (pickerState.field) {
      case 'breakStart':
        setBreakStartTime(selectedTime);
        break;
      case 'breakEnd':
        setBreakEndTime(selectedTime);
        break;
      case 'lunchStart':
        setLunchStartTime(selectedTime);
        break;
      case 'lunchEnd':
        setLunchEndTime(selectedTime);
        break;
      default:
        break;
    }

    setPickerState({ isVisible: false, mode: 'time', field: null });
  };

  const handleNext = () => {
    navigation.navigate('ReviewSchedule', {
      scheduleName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      periods,
      hasBreak,
      hasLunch,
      breakStartTime: format(breakStartTime, 'h:mm a'),
      breakEndTime: format(breakEndTime, 'h:mm a'),
      lunchStartTime: format(lunchStartTime, 'h:mm a'),
      lunchEndTime: format(lunchEndTime, 'h:mm a'),
      edit,
      existingSchedule,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Break and Lunch</Text>

        {/* Break Toggle */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Include Break</Text>
          <Switch
            value={hasBreak}
            onValueChange={setHasBreak}
            thumbColor={hasBreak ? colors.primary : '#ccc'}
          />
        </View>

        {hasBreak && (
          <View style={styles.timeRow}>
            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker('breakStart')}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Break Start: {format(breakStartTime, 'h:mm a')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker('breakEnd')}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Break End: {format(breakEndTime, 'h:mm a')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Lunch Toggle */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Include Lunch</Text>
          <Switch
            value={hasLunch}
            onValueChange={setHasLunch}
            thumbColor={hasLunch ? colors.primary : '#ccc'}
          />
        </View>

        {hasLunch && (
          <View style={styles.timeRow}>
            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker('lunchStart')}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Lunch Start: {format(lunchStartTime, 'h:mm a')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker('lunchEnd')}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Lunch End: {format(lunchEndTime, 'h:mm a')}
              </Text>
            </Pressable>
          </View>
        )}

        <AppButton
          title="Next"
          onPress={handleNext}
          style={{ marginTop: 32 }}
        />

        {pickerState.isVisible && (
          <DateTimePicker
            value={
              pickerState.field === 'breakStart'
                ? breakStartTime
                : pickerState.field === 'breakEnd'
                ? breakEndTime
                : pickerState.field === 'lunchStart'
                ? lunchStartTime
                : lunchEndTime
            }
            mode={pickerState.mode}
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
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
