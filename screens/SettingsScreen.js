// screens/SettingsScreen.js

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { useSettings, useSchedules } from "../context/AppContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import useTheme from "../hooks/useTheme";

export default function SettingsScreen() {
  const { isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime } = useSettings();
  const { schedules, activeScheduleId, deleteSchedule, setActiveScheduleId } = useSchedules();
  const navigation = useNavigation();
  const theme = useTheme();

  const activeSchedule = schedules.find(s => s.id === activeScheduleId);

  const handleDelete = () => {
    if (!activeSchedule) return;

    Alert.alert(
      "Delete Schedule",
      `Delete "${activeSchedule.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteSchedule(activeSchedule.id);
            setActiveScheduleId(null);
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ScheduleName" }],
      })
    );
  };

  const handleUpgrade = () => {
    Alert.alert("Coming Soon", "Pro features coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Back Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-outline" size={28} color={theme.colors.text} />
      </Pressable>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Schedule Section */}
        {!activeSchedule ? (
          <AppButton
            title="Add New Schedule"
            onPress={handleAddNew}
            style={styles.buttonMargin}
          />
        ) : (
          <View style={[styles.scheduleCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.scheduleText, { color: theme.colors.text }]}>
              Schedule: {activeSchedule.name}
            </Text>
            <View style={styles.buttonsRow}>
              <Pressable
                onPress={() => Alert.alert("Coming Soon", "Edit functionality will be added in a future update.")}
                style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
              >
                <Ionicons name="pencil" size={20} color={theme.colors.background} />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={[styles.iconButton, { backgroundColor: theme.colors.secondary }]}
              >
                <Ionicons name="trash" size={20} color={theme.colors.background} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Settings Toggles */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>24-Hour Time</Text>
          <Switch
            value={is24HourTime}
            onValueChange={setIs24HourTime}
            trackColor={{
              false: isDarkMode ? '#555' : theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={isDarkMode ? '#FFF' : (is24HourTime ? theme.colors.background : theme.colors.card)}
            ios_backgroundColor={isDarkMode ? "#555" : theme.colors.border} // 🔥 for iOS smooth fallback
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{
              false: isDarkMode ? '#555' : theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={isDarkMode ? '#FFF' : (isDarkMode ? theme.colors.background : theme.colors.card)}
            ios_backgroundColor={isDarkMode ? "#555" : theme.colors.border}
          />
        </View>

        {/* Upgrade to Pro Button */}
        <AppButton
          title="Upgrade to Pro"
          onPress={handleUpgrade}
          style={[styles.buttonMargin, { marginBottom: 32 }]}
          textColor={theme.colors.text}
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
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
  buttonMargin: {
    marginVertical: 16,
  },
});
