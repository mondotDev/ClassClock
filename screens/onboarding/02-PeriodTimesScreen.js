// screens/onboarding/PeriodTimesScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Animated,
  FlatList,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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
  const { width, height } = useWindowDimensions();
  const ITEM_WIDTH = width;

  const total = numPeriods + (hasZeroPeriod ? 1 : 0);

  const nav = useNavigation();

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
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickerState, setPickerState] = useState({ isVisible: false, mode: 'time', field: null });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const boxPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      { iterations: 2 }
    ).start();
  }, [currentIndex]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(boxPulse, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(boxPulse, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openTimePicker = (idx, type) =>
    setPickerState({ isVisible: true, mode: 'time', field: { idx, type } });

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime)
      return setPickerState({ isVisible: false, mode: 'time', field: null });
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

  const allFilled = periods.every(
    (p) => p.startTime && p.endTime && p.label.trim().length > 0
  );

  const handleNext = () => {
    const finalPeriods = periods.map((p) => ({
      label: p.label,
      startTime: format(p.startTime, 'h:mm a'),
      endTime: format(p.endTime, 'h:mm a'),
    }));
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

  const handleMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (index !== currentIndex) {
      Haptics.selectionAsync();
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.card, { width: ITEM_WIDTH, backgroundColor: colors.card }]}>
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
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ height: height * 0.55, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.FlatList
            data={periods}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
            disableIntervalMomentum={true}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={handleMomentumScrollEnd}
          />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 12 }}>
          <Animated.Text
            style={[styles.stepper, { color: colors.text, transform: [{ scale: pulseAnim }] }]}
          >
            Card {currentIndex + 1} of {periods.length}
          </Animated.Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]} />
            <Animated.View
              style={[
                styles.progressIndicator,
                {
                  backgroundColor: colors.primary,
                  width: scrollX.interpolate({
                    inputRange: [0, ITEM_WIDTH * (periods.length - 1)],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <AppButton title="Next" onPress={handleNext} disabled={!allFilled} />
      </View>
      {pickerState.isVisible && (
        <DateTimePicker
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
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  } catch (e) {
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
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  inlineIcon: {
    position: 'absolute',
    right: 20,
    top: '28%',
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
