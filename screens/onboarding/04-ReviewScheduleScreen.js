// screens/onboarding/04-ReviewScheduleScreen.js

import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";
import { useSchedules } from "../../context/AppContext"; // 🔥 Added

export default function ReviewScheduleScreen({ route }) {
  const { name, selectedDays, hasZero, periods, hasBreak, breakStartTime, breakEndTime, hasLunch, lunchStartTime, lunchEndTime } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();
  const { addSchedule } = useSchedules(); // 🔥 Added

  const handleSave = () => {
    const scheduleData = {
      id: Date.now().toString(), // 🔥 Unique ID
      name,
      selectedDays,
      hasZero,
      periods,
      hasBreak,
      breakStartTime,
      breakEndTime,
      hasLunch,
      lunchStartTime,
      lunchEndTime,
    };

    addSchedule(scheduleData); // 🔥 Save to Context!

    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Review Your Schedule
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Schedule Name:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{name}</Text>

          <Text style={[styles.label, { color: theme.colors.text }]}>Selected Days:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{selectedDays.join(", ")}</Text>

          {periods.map((p, idx) => (
            <View key={idx} style={styles.periodRow}>
              <Text style={[styles.label, { color: theme.colors.text }]}>{p.label}</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{p.startTime} - {p.endTime}</Text>
            </View>
          ))}

          {hasBreak && (
            <View style={styles.periodRow}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Break:</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{breakStartTime} - {breakEndTime}</Text>
            </View>
          )}

          {hasLunch && (
            <View style={styles.periodRow}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Lunch:</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{lunchStartTime} - {lunchEndTime}</Text>
            </View>
          )}
        </View>

        <AppButton
          title="Save Schedule"
          onPress={handleSave}
          style={styles.buttonMargin}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: "stretch",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
  periodRow: {
    marginTop: 12,
  },
  buttonMargin: {
    marginVertical: 16,
  },
});
