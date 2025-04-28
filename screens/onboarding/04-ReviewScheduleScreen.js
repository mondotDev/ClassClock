// screens/onboarding/04-ReviewScheduleScreen.js

import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";
import { useSchedules } from "../../context/AppContext";

export default function ReviewScheduleScreen({ route }) {
  const { name, selectedDays, hasZero, periods, hasBreak, breakStartTime, breakEndTime, hasLunch, lunchStartTime, lunchEndTime } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();
  const { addSchedule } = useSchedules();

  const handleSave = () => {
    const scheduleData = {
      id: Date.now().toString(),
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

    addSchedule(scheduleData);

    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Review Your Schedule
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          {/* Schedule Basic Info */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Schedule Name:</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{name}</Text>

            <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>Selected Days:</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{selectedDays.join(", ")}</Text>
          </View>

          {/* Periods */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Periods:</Text>
            {periods.map((p, idx) => (
              <View key={idx} style={styles.periodRow}>
                <Text style={[styles.label, { color: theme.colors.text }]}>{p.label}</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{p.startTime} - {p.endTime}</Text>
                {idx !== periods.length - 1 && <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />}
              </View>
            ))}
          </View>

          {/* Extras */}
          {(hasBreak || hasLunch) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Extra Times:</Text>

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
          )}
        </View>

        <AppButton
          title="Save Schedule"
          onPress={handleSave}
          style={{ marginVertical: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 48,
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  periodRow: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    opacity: 0.4,
  },
});
