// screens/SettingsScreen.js

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings, useSchedules } from "../context/AppContext";
import AppButton from "../components/AppButton";
import useTheme from "../hooks/useTheme";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime } = useSettings();
  const { schedules, activeScheduleId, deleteSchedule } = useSchedules();

  const [activeScheduleName, setActiveScheduleName] = useState(null);

  useEffect(() => {
    const schedule = schedules.find(s => s.id === activeScheduleId);
    setActiveScheduleName(schedule ? schedule.name : null);
  }, [schedules, activeScheduleId]);

  const handleDelete = () => {
    if (!activeScheduleId) return;
    Alert.alert("Delete Schedule", "Are you sure you want to delete this schedule?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteSchedule(activeScheduleId) },
    ]);
  };

  const handleAddNew = async () => {
    await AsyncStorage.removeItem("@hasOnboarded");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ScheduleName" }],
      })
    );
  };

  const handleEdit = () => {
    Alert.alert("Coming Soon", "Editing schedules will be available in a future update.");
  };

  const handleUpgrade = () => {
    Alert.alert("Coming Soon", "Pro features coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Schedule Section */}
        {!activeScheduleName ? (
          <AppButton title="Add New Schedule" onPress={handleAddNew} />
        ) : (
          <View style={[styles.scheduleCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.scheduleText, { color: theme.colors.text }]}>Schedule: {activeScheduleName}</Text>
            <View style={styles.buttonsRow}>
              <Pressable onPress={handleEdit} style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="pencil" size={20} color={theme.colors.background} />
              </Pressable>
              <Pressable onPress={handleDelete} style={[styles.iconButton, { backgroundColor: theme.colors.border }]}>
                <Ionicons name="trash" size={20} color={theme.colors.text} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Toggles */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>24-Hour Time</Text>
          <Switch
            value={is24HourTime}
            onValueChange={setIs24HourTime}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.thumb}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.thumb}
          />
        </View>

        <AppButton title="Upgrade to Pro" onPress={handleUpgrade} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    paddingHorizontal: 24,
    alignItems: "stretch",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  scheduleCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  label: {
    fontSize: 18,
  },
});
