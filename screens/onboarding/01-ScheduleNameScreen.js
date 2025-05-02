// screens/onboarding/ScheduleNameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import { useSchedules } from '../../context/AppContext';
import useTheme from '../../hooks/useTheme';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import ModalCard from '../../components/ModalCard'; // ✅ new

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ✅ new

  const navigation = useNavigation();
  const theme = useTheme();
  const { schedules } = useSchedules();

  const fadeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const translateAnims = useRef([
    new Animated.Value(30),
    new Animated.Value(30),
    new Animated.Value(30),
  ]).current;

  const inputScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations = fadeAnims.map((fade, index) =>
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 400,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnims[index], {
          toValue: 0,
          duration: 400,
          delay: index * 150,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(100, animations).start();
  }, []);

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
    Haptics.selectionAsync();
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const incrementPeriods = () => {
    if (numPeriods < 12) {
      setNumPeriods((prev) => prev + 1);
      Haptics.selectionAsync();
    }
  };

  const decrementPeriods = () => {
    if (numPeriods > 1) {
      setNumPeriods((prev) => prev - 1);
      Haptics.selectionAsync();
    }
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

    const duplicate = schedules.some((s) => {
      const match = s.scheduleName?.trim().toLowerCase() === trimmedName.toLowerCase();
      const sameSchedule = edit && existingSchedule && s.id === existingSchedule.id;
      return match && !sameSchedule;
    });

    if (duplicate) {
      Toast.show({
        type: 'error',
        text1: 'Duplicate Name',
        text2: 'A schedule with that name already exists.',
        position: 'top',
      });
      return;
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

    setShowConfirmModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Name Your Schedule</Text>

        {/* Name input */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              opacity: fadeAnims[0],
              transform: [{ translateY: translateAnims[0] }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={scheduleName}
              onChangeText={setScheduleName}
              placeholder="Enter schedule name"
              placeholderTextColor={theme.colors.text + '80'}
              onFocus={() =>
                Animated.spring(inputScale, {
                  toValue: 1.03,
                  useNativeDriver: true,
                }).start()
              }
              onBlur={() =>
                Animated.spring(inputScale, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start()
              }
            />
          </Animated.View>
        </Animated.View>

        {/* Days */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              opacity: fadeAnims[1],
              transform: [{ translateY: translateAnims[1] }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Days</Text>
          <View style={styles.chipContainer}>
            {daysOfWeek.map((day) => (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedDays.includes(day)
                      ? theme.colors.primary
                      : theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedDays.includes(day)
                      ? 'white'
                      : theme.colors.text,
                    fontWeight: '600',
                  }}
                >
                  {day}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Toggles */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              opacity: fadeAnims[2],
              transform: [{ translateY: translateAnims[2] }],
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Zero Period</Text>
            <Switch
              value={hasZeroPeriod}
              onValueChange={(v) => {
                Haptics.selectionAsync();
                setHasZeroPeriod(v);
              }}
              thumbColor={hasZeroPeriod ? theme.colors.primary : '#ccc'}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Periods: {numPeriods}</Text>
            <View style={styles.stepper}>
              <Pressable
                style={[styles.stepButton, { backgroundColor: theme.colors.background }]}
                onPress={decrementPeriods}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>-</Text>
              </Pressable>
              <Pressable
                style={[styles.stepButton, { backgroundColor: theme.colors.background }]}
                onPress={incrementPeriods}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>+</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <AppButton title="Next" onPress={handleNext} />
      </View>

      {/* ✅ Modal confirmation */}
      <ModalCard isVisible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: theme.colors.text }}>
          Proceed to Period Setup?
        </Text>
        <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
          You’ll set exact start and end times for each period next.
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppButton
            title="Cancel"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => setShowConfirmModal(false)}
          />
          <AppButton
            title="Continue"
            style={{ flex: 1 }}
            onPress={() => {
              setShowConfirmModal(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.navigate('PeriodTimes', {
                scheduleName: scheduleName.trim(),
                selectedDays,
                hasZeroPeriod,
                numPeriods,
                edit,
                existingSchedule,
              });
            }}
          />
        </View>
      </ModalCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
});
