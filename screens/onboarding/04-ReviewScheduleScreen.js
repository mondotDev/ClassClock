import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useSchedules } from "../../context/AppContext";
import StepBadge from "../../components/StepBadge";
import ShimmerHint from "../../components/ShimmerHint";

export default function ReviewScheduleScreen({ route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    periods,
    hasBreak,
    hasLunch,
    breakStartTime,
    breakEndTime,
    lunchStartTime,
    lunchEndTime,
    edit = false,
    existingSchedule = null,
  } = route.params ?? {};

  const { colors } = useTheme();
  const nav = useNavigation();

  const shimmerFade = useRef(new Animated.Value(1)).current;
  const shimmerTranslate = useRef(new Animated.Value(-100)).current;

  const fadeAnims = useRef(periods.map(() => new Animated.Value(0))).current;
  const translateAnims = useRef(
    periods.map(() => new Animated.Value(20))
  ).current;

  const { addSchedule, updateSchedule } = useSchedules();

  useEffect(() => {
    const animations = periods.map((_, i) =>
      Animated.parallel([
        Animated.timing(fadeAnims[i], {
          toValue: 1,
          duration: 400,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnims[i], {
          toValue: 0,
          duration: 400,
          delay: i * 100,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(100, animations).start();
  }, []);

  useEffect(() => {
    if (periods.length <= 4) return;

    shimmerFade.setValue(1);
    shimmerTranslate.setValue(-100);

    let loopCount = 0;
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslate, {
          toValue: 300,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslate, {
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
        Animated.timing(shimmerFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      shimmerLoop.stop();
      clearInterval(interval);
    };
  }, []);

  const handleFinish = () => {
    try {
      const newSchedule = {
        ...(existingSchedule || {}),
        id: existingSchedule?.id || Date.now().toString(),
        scheduleName,
        selectedDays,
        hasZeroPeriod,
        numPeriods: periods.length,
        periods,
        hasBreak,
        breakStartTime,
        breakEndTime,
        hasLunch,
        lunchStartTime,
        lunchEndTime,
      };

      if (edit && existingSchedule) {
        updateSchedule(newSchedule);
      } else {
        addSchedule(newSchedule);
      }

      nav.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Review Your Schedule</Text>
        <View style={styles.badgeWrapper}>
          <StepBadge step={4} totalSteps={4} colors={colors} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={
          periods.length > 4
            ? () => {
                Animated.timing(shimmerFade, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: false,
                }).start();
              }
            : undefined
        }
      >
        <Text style={[styles.label, { color: colors.text }]}>Schedule Name:</Text>
        <Text style={[styles.value, { color: colors.primary }]}>{scheduleName}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Days Selected:</Text>
        <Text style={[styles.value, { color: colors.primary }]}>{selectedDays.join(", ")}</Text>

        {typeof hasZeroPeriod !== "undefined" && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Zero Period:</Text>
            <Text style={styles.value}>{hasZeroPeriod ? "Yes" : "No"}</Text>
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>Class Periods:</Text>

        {periods.length > 4 && (
          <ShimmerHint
            text="Scroll to see the rest ↓"
            shimmerAnim={shimmerTranslate}
            shimmerFadeAnim={shimmerFade}
            colors={colors}
            containerStyle={{ marginTop: 12 }}
          />
        )}

        {periods.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                opacity: fadeAnims[i],
                transform: [{ translateY: translateAnims[i] }],
              },
            ]}
          >
            <Text style={[styles.periodLabel, { color: colors.text }]}>{p.label}</Text>
            <Text style={{ color: colors.text }}>{`${p.startTime} – ${p.endTime}`}</Text>
          </Animated.View>
        ))}

        {hasBreak && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Break:</Text>
            <Text style={styles.value}>{`${breakStartTime} – ${breakEndTime}`}</Text>
          </>
        )}

        {hasLunch && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Lunch:</Text>
            <Text style={styles.value}>{`${lunchStartTime} – ${lunchEndTime}`}</Text>
          </>
        )}

        <AppButton title="Finish" onPress={handleFinish} style={{ marginTop: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    marginTop: 48,
    marginBottom: 16,
    position: "relative",
  },
  badgeWrapper: {
    position: "absolute",
    top: 0,
    right: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  label: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "700",
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  periodLabel: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
});
