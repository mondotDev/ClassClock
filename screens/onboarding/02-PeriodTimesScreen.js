// screens/onboarding/PeriodTimesScreen.js

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  Animated,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DatePicker from 'react-native-date-picker';
import AppButton from '../../components/AppButton';
import ModalCard from '../../components/ModalCard';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PeriodTimesScreen({ navigation, route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    edit = false,
    existingSchedule = null,
  } = route.params;

  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ITEM_WIDTH = width * 0.92;
  const total = numPeriods + (hasZeroPeriod ? 1 : 0);

  const generateDefaultPeriods = () => {
    const base = new Date();
    base.setHours(8, 30, 0, 0);
    return Array.from({ length: total }, (_, i) => {
      const start = new Date(base.getTime() + i * 50 * 60000);
      const end = new Date(start.getTime() + 50 * 60000);
      return {
        label: hasZeroPeriod && i === 0 ? 'Zero Period' : `Period ${hasZeroPeriod ? i : i + 1}`,
        startTime: start,
        endTime: end,
      };
    });
  };

  const [periods, setPeriods] = useState(() =>
    edit && existingSchedule?.periods?.length
      ? existingSchedule.periods.map((p, i) => ({
          label: p.label || (hasZeroPeriod && i === 0 ? 'Zero Period' : `Period ${i + 1}`),
          startTime: parseTime(p.startTime),
          endTime: parseTime(p.endTime),
        }))
      : generateDefaultPeriods()
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickerState, setPickerState] = useState({ isVisible: false, mode: 'time', field: null });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const nextButtonOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const shimmerFadeAnim = useRef(new Animated.Value(1)).current;
  const stepFadeAnim = useRef(new Animated.Value(0)).current;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShimmer, setShowShimmer] = useState(true);

  const boxPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(stepFadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (currentIndex !== 0 || !showShimmer) return;

    let loopCount = 0;
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: width,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerLoop.start();

    const interval = setInterval(() => {
      loopCount++;
      if (loopCount >= 3) {
        shimmerLoop.stop();
        Animated.timing(shimmerFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowShimmer(false));
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      shimmerLoop.stop();
      clearInterval(interval);
    };
  }, [currentIndex, showShimmer]);

  useEffect(() => {
    Animated.timing(nextButtonOpacity, {
      toValue: currentIndex === periods.length - 1 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const openTimePicker = (idx, type) => {
    setPickerState({ isVisible: true, mode: 'time', field: { idx, type } });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime) {
      return setPickerState({ isVisible: false, mode: 'time', field: null });
    }
    const { idx, type } = pickerState.field;
    const updated = [...periods];
    updated[idx][type === 'start' ? 'startTime' : 'endTime'] = selectedTime;
    setPeriods(updated);
    setPickerState({ isVisible: false, mode: 'time', field: null });
  };

  const handleLabelChange = (idx, text) => {
    const updated = [...periods];
    updated[idx].label = text;
    setPeriods(updated);
  };

  const allFilled = periods.every(p => p.label.trim() && p.startTime && p.endTime);

  const handleNext = () => {
    setShowConfirmModal(true);
  };

  const proceedToBreakLunch = () => {
    const finalPeriods = periods.map(p => ({
      label: p.label,
      startTime: format(p.startTime, 'h:mm a'),
      endTime: format(p.endTime, 'h:mm a'),
    }));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowConfirmModal(false);

    navigation.navigate('BreakLunch', {
      scheduleName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      periods: finalPeriods,
      edit,
      existingSchedule,
    });
  };

  const handleMomentumScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (index !== currentIndex) {
      Haptics.selectionAsync();
      setCurrentIndex(index);
    }
  };

  const renderItem = useCallback(({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    const tilt = scrollX.interpolate({
      inputRange,
      outputRange: ['5deg', '0deg', '-5deg'],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.card,
          {
            width: ITEM_WIDTH,
            backgroundColor: colors.card,
            transform: [{ rotateY: tilt }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={[styles.inputLabel, { color: colors.text }]}>Enter your class name</Text>
        <Animated.View style={[styles.inputWrapper, { transform: [{ scale: boxPulse }] }]}>
          <TextInput
            value={item.label}
            onChangeText={(text) => handleLabelChange(index, text)}
            placeholder={`Class Name`}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholderTextColor={colors.border}
          />
          <Ionicons name="pencil" size={20} color={colors.border} style={styles.inlineIcon} />
        </Animated.View>
        <View style={styles.timeRow}>
          <Pressable
            style={[styles.timeButton, { backgroundColor: colors.primary }]}
            onPress={() => openTimePicker(index, 'start')}
          >
            <Text style={[styles.timeButtonText, { color: colors.background }]}>
              Start: {format(item.startTime, 'h:mm a')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.timeButton, { backgroundColor: colors.primary }]}
            onPress={() => openTimePicker(index, 'end')}
          >
            <Text style={[styles.timeButtonText, { color: colors.background }]}>
              End: {format(item.endTime, 'h:mm a')}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }, [colors, boxPulse, fadeAnim]);

  const progress = Animated.divide(scrollX, ITEM_WIDTH);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          right: 16,
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: colors.card,
          borderRadius: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          opacity: stepFadeAnim,
          zIndex: 10,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Step 2 of 4</Text>
      </Animated.View>

      <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 32 }}>
        <Animated.FlatList
          data={periods}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={ITEM_WIDTH}
          disableIntervalMomentum
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        />

        {currentIndex === 0 && showShimmer && (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <View style={{ position: 'relative', overflow: 'hidden' }}>
              <Animated.Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.border,
                  opacity: shimmerFadeAnim,
                }}
              >
                Swipe to continue →
              </Animated.Text>
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '100%',
                  transform: [{ translateX: shimmerAnim }],
                }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ width: 100, height: '100%' }}
                />
              </Animated.View>
            </View>
          </View>
        )}

        <View style={{ alignItems: 'center' }}>
          <Animated.Text
            style={[styles.stepper, { color: colors.text, transform: [{ scale: pulseAnim }] }]}
          >
            Class {currentIndex + 1} of {periods.length}
          </Animated.Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]} />
            <Animated.View
              style={[
                styles.progressIndicator,
                {
                  backgroundColor: colors.primary,
                  transform: [
                    {
                      scaleX: progress.interpolate({
                        inputRange: [0, periods.length - 1],
                        outputRange: [0.01, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        <Animated.View style={{ width: '100%', opacity: nextButtonOpacity }}>
          <AppButton title="Next" onPress={handleNext} disabled={!allFilled} />
        </Animated.View>
      </View>

      {pickerState.isVisible && (
        <DatePicker
          value={
            pickerState.field?.type === 'start'
              ? periods[pickerState.field.idx].startTime
              : periods[pickerState.field.idx].endTime
          }
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <ModalCard isVisible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: colors.text }}>
          Continue to Break & Lunch?
        </Text>
        <Text style={{ color: colors.text, marginBottom: 20 }}>
          You can always go back and edit period times later.
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
            onPress={proceedToBreakLunch}
            disabled={!allFilled}
          />
        </View>
      </ModalCard>
    </SafeAreaView>
  );
}

function parseTime(timeString) {
  try {
    const [time, ampm] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  } catch {
    return new Date();
  }
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    marginTop: 162,
    height: 240,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  inlineIcon: {
    position: 'absolute',
    right: 20,
    top: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepper: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'transparent',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    opacity: 0.3,
  },
  progressIndicator: {
    height: 8,
    borderRadius: 4,
  },
});
