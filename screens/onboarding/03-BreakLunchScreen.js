// screens/onboarding/BreakLunchScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
  Animated,
} from "react-native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";
import { format } from "date-fns";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StepBadge from "../../components/StepBadge";
import ContinueModal from "../../components/ContinueModal";
import * as Haptics from "expo-haptics";
import OnboardingContainer from "../../components/OnboardingContainer";

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
  const nav = useNavigation();

  const [hasBreak, setHasBreak] = useState(false);
  const [hasLunch, setHasLunch] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(new Date());
  const [breakEndTime, setBreakEndTime] = useState(new Date());
  const [lunchStartTime, setLunchStartTime] = useState(new Date());
  const [lunchEndTime, setLunchEndTime] = useState(new Date());

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    mode: "time",
    field: null,
  });

  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const shimmerFadeAnim = useRef(new Animated.Value(1)).current;
  const [showShimmer, setShowShimmer] = useState(true);

  const stepFade = useRef(new Animated.Value(0)).current;
  const breakFade = useRef(new Animated.Value(0)).current;
  const lunchFade = useRef(new Animated.Value(0)).current;
  const nextFade = useRef(new Animated.Value(0)).current;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (edit && !existingSchedule) {
      Toast.show({
        type: "error",
        text1: "Schedule not found",
        text2: "Returning to Home screen.",
        position: "top",
      });
      nav.replace("Home");
    }
  }, []);

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(breakFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(lunchFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(nextFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(stepFade, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!showShimmer) return;

    let loopCount = 0;
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 300,
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
  }, [showShimmer]);

  const openTimePicker = (field) => {
    setPickerState({ isVisible: true, mode: "time", field });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed" || !selectedTime) {
      setPickerState({ isVisible: false, field: null });
      return;
    }

    switch (pickerState.field) {
      case "breakStart":
        setBreakStartTime(selectedTime);
        break;
      case "breakEnd":
        setBreakEndTime(selectedTime);
        break;
      case "lunchStart":
        setLunchStartTime(selectedTime);
        break;
      case "lunchEnd":
        setLunchEndTime(selectedTime);
        break;
    }

    setPickerState({ isVisible: false, field: null });
  };

  const handleNext = () => {
    setShowConfirmModal(true);
  };

  const proceedToReview = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowConfirmModal(false);
    navigation.navigate("ReviewSchedule", {
      scheduleName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      periods,
      hasBreak,
      hasLunch,
      breakStartTime: format(breakStartTime, "h:mm a"),
      breakEndTime: format(breakEndTime, "h:mm a"),
      lunchStartTime: format(lunchStartTime, "h:mm a"),
      lunchEndTime: format(lunchEndTime, "h:mm a"),
      edit,
      existingSchedule,
    });
  };

  return (
    <OnboardingContainer>
      <StepBadge step={3} totalSteps={4} colors={colors} fadeAnim={stepFade} />

      <Text style={[styles.title, { color: colors.text }]}>
        Break and Lunch
      </Text>

      <Animated.View style={[styles.card, { backgroundColor: colors.card, opacity: breakFade }]}>
        <View style={styles.row}>
          <View style={styles.labelRow}>
            <Ionicons name="cafe-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.label, { color: colors.text }]}>Include Break</Text>
          </View>
          <Switch
            value={hasBreak}
            onValueChange={setHasBreak}
            thumbColor={hasBreak ? colors.primary : "#ccc"}
          />
        </View>

        {hasBreak && (
          <View style={styles.timeRow}>
            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker("breakStart")}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Start: {format(breakStartTime, "h:mm a")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker("breakEnd")}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                End: {format(breakEndTime, "h:mm a")}
              </Text>
            </Pressable>
          </View>
        )}
      </Animated.View>

      <Animated.View style={[styles.card, { backgroundColor: colors.card, opacity: lunchFade }]}>
        <View style={styles.row}>
          <View style={styles.labelRow}>
            <Ionicons name="restaurant-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.label, { color: colors.text }]}>Include Lunch</Text>
          </View>
          <Switch
            value={hasLunch}
            onValueChange={setHasLunch}
            thumbColor={hasLunch ? colors.primary : "#ccc"}
          />
        </View>

        {hasLunch && (
          <View style={styles.timeRow}>
            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker("lunchStart")}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                Start: {format(lunchStartTime, "h:mm a")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={() => openTimePicker("lunchEnd")}
            >
              <Text style={[styles.timeButtonText, { color: colors.background }]}>
                End: {format(lunchEndTime, "h:mm a")}
              </Text>
            </Pressable>
          </View>
        )}
      </Animated.View>

      <View style={{ alignItems: "center", marginTop: 8, height: 24 }}>
        {showShimmer && (
          <View style={{ position: "relative", overflow: "hidden" }}>
            <Animated.Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: colors.border,
                opacity: shimmerFadeAnim,
              }}
            >
              Optional – skip if not needed →
            </Animated.Text>
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "100%",
                transform: [{ translateX: shimmerAnim }],
              }}
            >
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ width: 100, height: "100%" }}
              />
            </Animated.View>
          </View>
        )}
      </View>

      <Animated.View style={{ opacity: nextFade, width: "100%" }}>
        <AppButton title="Next" onPress={handleNext} style={{ marginTop: 36 }} />
      </Animated.View>

      {pickerState.isVisible && (
        <DatePicker
          value={
            pickerState.field === "breakStart"
              ? breakStartTime
              : pickerState.field === "breakEnd"
              ? breakEndTime
              : pickerState.field === "lunchStart"
              ? lunchStartTime
              : lunchEndTime
          }
          mode={pickerState.mode}
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      <ContinueModal
        visible={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onContinue={proceedToReview}
        title="Continue to Review?"
        message="You can still go back and edit your schedule later."
        colors={colors}
      />
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
