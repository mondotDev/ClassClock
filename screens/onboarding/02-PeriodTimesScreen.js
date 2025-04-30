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
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { format } from 'date-fns';

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
  const ITEM_WIDTH = width * 0.85;

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

  const [periods, setPeriods] = useState(() => {
    if (edit && existingSchedule?.periods?.length) {
      return existingSchedule.periods.map((p, i) => ({
        label: p.label || (hasZeroPeriod && i === 0 ? 'Zero Period' : `Period ${i + 1}`),
        startTime: parseTime(p.startTime),
        endTime: parseTime(p.endTime),
      }));
    } else {
      return generateDefaultPeriods();
    }
  });

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: 'time',
    field: null,
  });

  const arrowOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowOpacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(arrowOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    ).start();
  }, []);

  const openTimePicker = (idx, type) => {
    setPickerState({ isVisible: true, mode: 'time', field: { idx, type } });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed' || !selectedTime) {
      setPickerState({ isVisible: false, mode: 'time', field: null });
      return;
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

  const allFilled = periods.every(p => p.startTime && p.endTime && p.label.trim().length > 0);

  const handleNext = () => {
    const finalPeriods = periods.map(p => ({
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

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];
    const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' });
    const shadowOpacity = scrollX.interpolate({ inputRange, outputRange: [0.05, 0.2, 0.05], extrapolate: 'clamp' });

    return (
      <Animated.View
        style={[styles.card, {
          width: ITEM_WIDTH,
          backgroundColor: colors.card,
          transform: [{ scale }],
          opacity,
          shadowOpacity,
        }]}
      >
        <TextInput
          value={item.label}
          onChangeText={text => handleLabelChange(index, text)}
          placeholder={`Period ${index + 1}`}
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholderTextColor={colors.border}
        />
        <View style={styles.timeRow}>
          <Pressable style={[styles.timeButton, { backgroundColor: colors.primary }]} onPress={() => openTimePicker(index, 'start')}>
            <Text style={[styles.timeButtonText, { color: colors.background }]}>Start: {format(item.startTime, 'h:mm a')}</Text>
          </Pressable>
          <Pressable style={[styles.timeButton, { backgroundColor: colors.primary }]} onPress={() => openTimePicker(index, 'end')}>
            <Text style={[styles.timeButtonText, { color: colors.background }]}>End: {format(item.endTime, 'h:mm a')}</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 20 }}>
        <View style={styles.centeredCarousel}>
          <Animated.FlatList
            ref={flatListRef}
            data={periods}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { x: scrollX } } }
            ], { useNativeDriver: true })}
            onMomentumScrollEnd={handleMomentumScrollEnd}
          />
          <Animated.Text style={[styles.arrowHint, { opacity: arrowOpacity, color: colors.border }]}>➡ Swipe →</Animated.Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <AppButton title="Next" onPress={handleNext} disabled={!allFilled} />
      </View>
      {pickerState.isVisible && (
        <DateTimePicker
          value={pickerState.field?.type === 'start'
            ? periods[pickerState.field.idx].startTime
            : periods[pickerState.field.idx].endTime}
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
  centeredCarousel: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 200,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
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
  arrowHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});
