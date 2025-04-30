import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import AppChip from "../../components/AppChip";
import { useSchedules } from "../../context/AppContext";
import useTheme from "../../hooks/useTheme";
import Toast from "react-native-toast-message";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ScheduleNameScreen({ route }) {
  const { params } = route || {};
  const {
    scheduleName: initialName = "",
    selectedDays: initialDays = [],
    hasZeroPeriod: initialZero = false,
    numPeriods: initialPeriods = 6,
    edit = false,
    existingSchedule = null,
  } = params || {};

  const [scheduleName, setScheduleName] = useState(initialName);
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [hasZeroPeriod, setHasZeroPeriod] = useState(initialZero);
  const [numPeriods, setNumPeriods] = useState(initialPeriods);

  const navigation = useNavigation();
  const theme = useTheme();
  const { schedules } = useSchedules();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const incrementPeriods = () => {
    if (numPeriods < 12) setNumPeriods((prev) => prev + 1);
  };

  const decrementPeriods = () => {
    if (numPeriods > 1) setNumPeriods((prev) => prev - 1);
  };

  const handleNext = () => {
    const trimmedName = scheduleName.trim();

    if (!trimmedName) {
      Toast.show({
        type: "error",
        text1: "Missing Name",
        text2: "Please enter a schedule name.",
        position: "top",
      });
      return;
    }

    const nameLower = trimmedName.toLowerCase();

    const isDuplicate = schedules.some((s) => {
      const existingName = s.name.trim().toLowerCase();
      if (edit && existingSchedule?.name?.trim().toLowerCase() === existingName) {
        return false;
      }
      return existingName === nameLower;
    });

    if (isDuplicate) {
      Toast.show({
        type: "error",
        text1: "Duplicate Name",
        text2: "A schedule with that name already exists.",
        position: "top",
      });
      return;
    }

    if (selectedDays.length === 0) {
      Toast.show({
        type: "error",
        text1: "Select Days",
        text2: "Please select at least one day for this schedule.",
        position: "top",
      });
      return;
    }

    navigation.navigate("PeriodTimes", {
      scheduleName: trimmedName,
      selectedDays,
      hasZeroPeriod,
      numPeriods,
      edit,
      existingSchedule,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Name Your Schedule
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          value={scheduleName}
          onChangeText={setScheduleName}
          placeholder="Enter schedule name"
          placeholderTextColor={theme.colors.text + "80"}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Select Days
        </Text>
        <View style={styles.chipContainer}>
          {daysOfWeek.map((day) => (
            <AppChip
              key={day}
              label={day}
              selected={selectedDays.includes(day)}
              onPress={() => toggleDay(day)}
            />
          ))}
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Zero Period
          </Text>
          <Switch
            value={hasZeroPeriod}
            onValueChange={setHasZeroPeriod}
            thumbColor={theme.colors.thumb}
            trackColor={{ false: "#ccc", true: theme.colors.primary }}
          />
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Periods: {numPeriods}
          </Text>
          <View style={styles.stepper}>
            <Pressable
              style={[
                styles.stepButton,
                { backgroundColor: theme.colors.card },
              ]}
              onPress={decrementPeriods}
            >
              <Text style={[styles.stepText, { color: theme.colors.text }]}>
                -
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.stepButton,
                { backgroundColor: theme.colors.card },
              ]}
              onPress={incrementPeriods}
            >
              <Text style={[styles.stepText, { color: theme.colors.text }]}>
                +
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginBottom: 32 }}>
          <AppButton title="Next" onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // center alignment for chips
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  stepText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
