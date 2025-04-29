// screens/onboarding/00-ScheduleNameScreen.js

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
} from "react-native";
import AppButton from "../../components/AppButton";
import useTheme from "../../hooks/useTheme";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function ScheduleNameScreen({ navigation, route }) {
  const theme = useTheme();
  const { edit = false, existingSchedule = null } = route.params || {};

  const [scheduleName, setScheduleName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [hasZero, setHasZero] = useState(false);
  const [periodCount, setPeriodCount] = useState("6");

  useEffect(() => {
    if (edit && existingSchedule) {
      setScheduleName(existingSchedule.name || "");
      setSelectedDays(existingSchedule.selectedDays || []);
      setHasZero(existingSchedule.hasZero || false);
      setPeriodCount(existingSchedule.count?.toString() || "6");
    }
  }, [edit, existingSchedule]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    navigation.navigate("PeriodTimes", {
      edit,
      existingSchedule,
      name: scheduleName.trim(),
      selectedDays,
      hasZero,
      count: periodCount,
    });
  };

  const isNextDisabled = scheduleName.trim().length === 0 || selectedDays.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.text }]}>  
            {edit ? "Edit Schedule Name" : "Name Your Schedule"}
          </Text>

          <TextInput
            value={scheduleName}
            onChangeText={setScheduleName}
            placeholder="Enter schedule name"
            placeholderTextColor={theme.colors.border}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />

          <Text style={[styles.subLabel, { color: theme.colors.text }]}>Select Days:</Text>
          <View style={styles.chipContainer}>
            {DAY_LABELS.map((day) => {
              const selected = selectedDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected
                        ? theme.colors.primary
                        : theme.colors.card,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? theme.colors.background : theme.colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Zero Period Toggle */}
          <View style={styles.toggleRow}>
            <Text style={[styles.subLabel, { color: theme.colors.text }]}>Start with Zero Period?</Text>
            <Switch
              value={hasZero}
              onValueChange={setHasZero}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.thumb}
            />
          </View>

          {/* Period Count Input */}
          <View style={styles.periodCountRow}>
            <Text style={[styles.subLabel, { color: theme.colors.text }]}>Number of Periods:</Text>
            <TextInput
              value={periodCount}
              onChangeText={setPeriodCount}
              placeholder="6"
              keyboardType="numeric"
              style={[styles.periodInput, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholderTextColor={theme.colors.border}
            />
          </View>

          <AppButton
            title="Next"
            onPress={handleNext}
            disabled={isNextDisabled}
            style={{ marginTop: 32 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    paddingHorizontal: 24,
    alignItems: "stretch",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  subLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  periodCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  periodInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    width: 80,
    textAlign: "center",
  },
});
