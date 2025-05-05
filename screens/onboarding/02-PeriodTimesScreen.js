// screens/onboarding/PeriodTimesScreen.js

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";

import ClassCard from "../../components/ClassCard";
import AppButton from "../../components/AppButton";
import ContinueModal from "../../components/ContinueModal";
import StepBadge from "../../components/StepBadge";
import useShimmerHint from "../../hooks/useShimmerHint";
import ShimmerHint from "../../components/ShimmerHint";
import useTheme from "../../hooks/useTheme";
import OnboardingContainer from "../../components/OnboardingContainer";
import { parseTime, generateDefaultPeriods } from "../../utils/scheduleUtils";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

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
  const total = numPeriods + (hasZeroPeriod ? 1 : 0);

  const [periods, setPeriods] = useState(
    edit && existingSchedule?.periods?.length
      ? existingSchedule.periods.map((p, i) => ({
          label:
            p.label ||
            (hasZeroPeriod && i === 0 ? "Zero Period" : `Period ${i + 1}`),
          startTime: parseTime(p.startTime),
          endTime: parseTime(p.endTime),
        }))
      : generateDefaultPeriods(total, hasZeroPeriod)
  );

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const buttonFadeAnim = useRef(new Animated.Value(periods.length === 1 ? 1 : 0)).current;

  const {
    shimmerAnim: shimmerAnim1,
    shimmerFadeAnim: shimmerFadeAnim1,
    showShimmer: showShimmer1,
  } = useShimmerHint({ trigger: index === 0 && periods.length > 1, cycles: 5 });

  const {
    shimmerAnim: shimmerAnim2,
    shimmerFadeAnim: shimmerFadeAnim2,
    showShimmer: showShimmer2,
  } = useShimmerHint({ trigger: index > 0 });

  const animateToIndex = (newIndex) => {
    if (newIndex < 0 || newIndex >= periods.length || animating) return;
    setAnimating(true);

    const direction = newIndex > index ? -1 : 1;

    Animated.timing(pan, {
      toValue: { x: direction * width, y: 0 },
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      requestAnimationFrame(() => {
        pan.setValue({ x: 0, y: 0 });
        setIndex(newIndex);
        setAnimating(false);
        Haptics.selectionAsync();

        if (newIndex === periods.length - 1) {
          Animated.timing(buttonFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          buttonFadeAnim.setValue(0);
        }
      });
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    const { state, translationX } = event.nativeEvent;
    if (state === State.END) {
      if (translationX < -SWIPE_THRESHOLD && index < periods.length - 1) {
        animateToIndex(index + 1);
      } else if (translationX > SWIPE_THRESHOLD && index > 0) {
        animateToIndex(index - 1);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const allFilled = periods.every(
    (p) => p.label.trim() && p.startTime && p.endTime
  );

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <OnboardingContainer>
        <StepBadge step={2} totalSteps={4} colors={colors} />

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              key={index}
              style={{
                width: width * 0.92,
                transform: [{ translateX: pan.x }],
              }}
            >
              <ClassCard
                label={periods[index]?.label}
                startTime={periods[index]?.startTime}
                endTime={periods[index]?.endTime}
                onLabelChange={(text) => {
                  const updated = [...periods];
                  updated[index].label = text;
                  setPeriods(updated);
                }}
                onTimePress={(type, newTime) => {
                  const updated = [...periods];
                  updated[index][type + "Time"] = newTime;
                  setPeriods(updated);
                }}
                width={width}
              />
            </Animated.View>
          </PanGestureHandler>

          <View style={{ marginTop: 20, height: 24 }}>
            {index === 0 && showShimmer1 && (
              <ShimmerHint
                text="Swipe to continue →"
                shimmerAnim={shimmerAnim1}
                shimmerFadeAnim={shimmerFadeAnim1}
                colors={colors}
              />
            )}
            {index > 0 && showShimmer2 && (
              <ShimmerHint
                text="← Scroll Back, Or Forward For More →"
                shimmerAnim={shimmerAnim2}
                shimmerFadeAnim={shimmerFadeAnim2}
                colors={colors}
              />
            )}
          </View>

          <View style={{ marginTop: 36, width: "100%", height: 64 }}>
            <Animated.View style={{ opacity: buttonFadeAnim }}>
              {(periods.length === 1 || index === periods.length - 1) && (
                <AppButton
                  title="Next"
                  onPress={() => setShowConfirmModal(true)}
                  disabled={!allFilled}
                />
              )}
            </Animated.View>
          </View>
        </View>

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
    </TouchableWithoutFeedback>
  );
}
