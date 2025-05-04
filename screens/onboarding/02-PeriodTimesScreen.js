import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Animated,
  useWindowDimensions,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import DatePicker from "react-native-date-picker";
import { format } from "date-fns";

// Components
import AppButton from "../../components/AppButton";
import ClassCard from "../../components/ClassCard";
import ShimmerHint from "../../components/ShimmerHint";
import StepBadge from "../../components/StepBadge";
import PeriodProgress from "../../components/PeriodProgress";
import ContinueModal from "../../components/ContinueModal";
import OnboardingContainer from "../../components/OnboardingContainer";

// Hooks
import useTheme from "../../hooks/useTheme";

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
  const ITEM_WIDTH = width * 0.92;
  const total = numPeriods + (hasZeroPeriod ? 1 : 0);

  const generateDefaultPeriods = () => {
    const base = new Date();
    base.setHours(8, 30, 0, 0);
    return Array.from({ length: total }, (_, i) => {
      const start = new Date(base.getTime() + i * 50 * 60000);
      const end = new Date(start.getTime() + 50 * 60000);
      return {
        label:
          hasZeroPeriod && i === 0
            ? "Zero Period"
            : `Period ${hasZeroPeriod ? i : i + 1}`,
        startTime: start,
        endTime: end,
      };
    });
  };

  const [periods, setPeriods] = useState(() =>
    edit && existingSchedule?.periods?.length
      ? existingSchedule.periods.map((p, i) => ({
          label:
            p.label ||
            (hasZeroPeriod && i === 0 ? "Zero Period" : `Period ${i + 1}`),
          startTime: parseTime(p.startTime),
          endTime: parseTime(p.endTime),
        }))
      : generateDefaultPeriods()
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: "time",
    field: null,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const nextButtonOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const shimmerFadeAnim = useRef(new Animated.Value(1)).current;
  const stepFadeAnim = useRef(new Animated.Value(0)).current;
  const stepTranslateAnim = useRef(new Animated.Value(-10)).current;
  const boxPulse = useRef(new Animated.Value(1)).current;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShimmer, setShowShimmer] = useState(true);

  const cardEntranceAnim = useRef(
    periods.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(stepFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(stepTranslateAnim, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.stagger(
        100,
        cardEntranceAnim.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
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
    setPickerState({ isVisible: true, mode: "time", field: { idx, type } });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed" || !selectedTime) {
      return setPickerState({ isVisible: false, mode: "time", field: null });
    }
    const { idx, type } = pickerState.field;
    const updated = [...periods];
    updated[idx][type === "start" ? "startTime" : "endTime"] = selectedTime;
    setPeriods(updated);
    setPickerState({ isVisible: false, mode: "time", field: null });
  };

  const handleLabelChange = (idx, text) => {
    const updated = [...periods];
    updated[idx].label = text;
    setPeriods(updated);
  };

  const allFilled = periods.every(
    (p) => p.label.trim() && p.startTime && p.endTime
  );

  const handleNext = () => setShowConfirmModal(true);

  const proceedToBreakLunch = () => {
    const finalPeriods = periods.map((p) => ({
      label: p.label,
      startTime: format(p.startTime, "h:mm a"),
      endTime: format(p.endTime, "h:mm a"),
    }));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowConfirmModal(false);

    navigation.navigate("BreakLunch", {
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

  const renderItem = useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];
      const tilt = scrollX.interpolate({
        inputRange,
        outputRange: ["5deg", "0deg", "-5deg"],
        extrapolate: "clamp",
      });

      return (
        <ClassCard
          label={item.label}
          startTime={item.startTime}
          endTime={item.endTime}
          onLabelChange={(text) => handleLabelChange(index, text)}
          onTimePress={(type) => openTimePicker(index, type)}
          tiltAnim={tilt}
          entranceAnim={cardEntranceAnim[index]}
          boxPulse={boxPulse}
          width={width}
        />
      );
    },
    [colors, boxPulse, cardEntranceAnim]
  );

  const progress = Animated.divide(scrollX, ITEM_WIDTH);

  return (
    <OnboardingContainer style={{ gap: 24 }}>
      <StepBadge
        step={2}
        totalSteps={4}
        colors={colors}
        fadeAnim={stepFadeAnim}
        translateAnim={stepTranslateAnim}
      />

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
        contentContainerStyle={{
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
        }}
      />

      <Animated.View style={{ alignItems: "center", gap: 12, marginTop: 24, opacity: fadeAnim }}>
        {currentIndex === 0 && showShimmer && (
          <ShimmerHint
            text="Swipe right to enter next class →"
            shimmerAnim={shimmerAnim}
            shimmerFadeAnim={shimmerFadeAnim}
            colors={colors}
          />
        )}

        <PeriodProgress
          currentIndex={currentIndex}
          total={periods.length}
          progressAnim={progress}
          colors={colors}
          pulseAnim={pulseAnim}
          labelSingular="Class"
        />
      </Animated.View>

      <Animated.View style={{ width: "100%", opacity: nextButtonOpacity }}>
        <AppButton title="Next" onPress={handleNext} disabled={!allFilled} />
      </Animated.View>

      {pickerState.isVisible && (
        <DatePicker
          value={
            pickerState.field?.type === "start"
              ? periods[pickerState.field.idx].startTime
              : periods[pickerState.field.idx].endTime
          }
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      <ContinueModal
        visible={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onContinue={proceedToBreakLunch}
        title="Continue to Break & Lunch?"
        message="You can always go back and edit period times later."
        colors={colors}
        disabled={!allFilled}
      />
    </OnboardingContainer>
  );
}

function parseTime(timeString) {
  try {
    const [time, ampm] = timeString.split(" ");
    let [hours, minutes] = time.split(":" ).map(Number);
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  } catch {
    return new Date();
  }
}
