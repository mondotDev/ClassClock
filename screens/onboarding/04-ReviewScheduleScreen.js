// screens/onboarding/04-ReviewScheduleScreen.js

import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Platform, ToastAndroid, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";
import { useSchedules } from "../../context/AppContext";

export default function ReviewScheduleScreen({ route }) {
  const { name, selectedDays, hasZero, count, periods, hasBreak, breakStartTime, breakEndTime, hasLunch, lunchStartTime, lunchEndTime } = route.params;
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

    if (Platform.OS === 'android') {
      ToastAndroid.show('Schedule Created!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Schedule Created!');
    }

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }, 500); // slight delay before navigating
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Review Your Schedule
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          
          {/* Schedule Basic Info */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Schedule Name</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{name}</Text>
          </View>

          {/* Selected Days */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Selected Days</Text>
            <View style={styles.chipContainer}>
              {selectedDays.map((day, idx) => (
                <View key={idx} style={[styles.chip, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.chipText, { color: theme.colors.background }]}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Periods */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Periods</Text>
            {periods.map((p, idx) => {
              const safeLabel = p.label.trim().length > 0
                ? p.label
                : hasZero && idx === 0
                ? "Zero Period"
                : `Period ${hasZero ? idx : idx + 1}`;

              return (
                <View key={idx} style={styles.periodRow}>
                  <View style={styles.periodHeader}>
                    <Text style={[styles.periodLabel, { color: theme.colors.text }]}>{safeLabel}</Text>
                    <Text style={[styles.periodTime, { color: theme.colors.text }]}>
                      {p.startTime} - {p.endTime}
                    </Text>
                  </View>
                  {idx !== periods.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Extras */}
          {(hasBreak || hasLunch) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Extra Times</Text>

              {hasBreak && (
                <View style={styles.periodRow}>
                  <View style={styles.periodHeader}>
                    <Text style={[styles.periodLabel, { color: theme.colors.text }]}>Break</Text>
                    <Text style={[styles.periodTime, { color: theme.colors.text }]}>
                      {breakStartTime} - {breakEndTime}
                    </Text>
                  </View>
                </View>
              )}

              {hasLunch && (
                <View style={styles.periodRow}>
                  <View style={styles.periodHeader}>
                    <Text style={[styles.periodLabel, { color: theme.colors.text }]}>Lunch</Text>
                    <Text style={[styles.periodTime, { color: theme.colors.text }]}>
                      {lunchStartTime} - {lunchEndTime}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

        </View>

        <AppButton
          title="Save Schedule"
          onPress={handleSave}
          style={{ marginTop: 32 }}
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
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    padding: 28,
    borderRadius: 16,
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
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  periodRow: {
    marginBottom: 16,
  },
  periodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  periodTime: {
    fontSize: 16,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    marginTop: 12,
    marginBottom: 12,
    opacity: 0.3,
  },
});
// This screen allows users to review their schedule before saving it. It displays the schedule name, selected days, periods, and any extra times (break/lunch). The user can save the schedule, which will be added to the context and reset the navigation stack to the home screen.
// The screen uses a card layout for better visual separation and includes a button to save the schedule. The styles are responsive to the theme colors for better integration with the app's design.