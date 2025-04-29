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
import { format } from "date-fns";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime } =
    useSettings();
  const { schedules, deleteSchedule, isPro, setIsPro } = useSchedules();

  const [todaySchedule, setTodaySchedule] = useState(null);

  useEffect(() => {
    const today = format(new Date(), "EEE"); // Mon, Tue, etc.
    const match = schedules.find((s) => s.selectedDays?.includes(today));
    setTodaySchedule(match || null);
  }, [schedules]);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete this schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSchedule(id),
        },
      ]
    );
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

  const handleEdit = (schedule) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "ScheduleName",
            params: {
              edit: true,
              existingSchedule: schedule,
            },
          },
        ],
      })
    );
  };

  const handleUpgrade = () => {
    Alert.alert("Coming Soon", "Pro features coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Active Schedule */}
        {todaySchedule && (
          <View
            style={[styles.activeCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Today's Active Schedule
            </Text>
            <Text
              style={[
                styles.scheduleText,
                { color: theme.colors.text, marginTop: 12 },
              ]}
            >
              {todaySchedule.name}
            </Text>
          </View>
        )}

        {/* Saved Schedules */}
        {schedules.length > 0 && (
          <View style={styles.savedSchedulesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Saved Schedules
            </Text>
            {schedules.map((schedule) => (
              <View
                key={schedule.id}
                style={[
                  styles.scheduleCard,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={[styles.scheduleText, { color: theme.colors.text }]}
                >
                  {schedule.name}
                </Text>
                <View style={styles.buttonsRow}>
                  <Pressable
                    onPress={() => handleEdit(schedule)}
                    style={[
                      styles.iconButton,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Ionicons
                      name="pencil"
                      size={20}
                      color={theme.colors.background}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(schedule.id)}
                    style={[
                      styles.iconButton,
                      { backgroundColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons
                      name="trash"
                      size={20}
                      color={theme.colors.text}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Create New Schedule */}
        {(isPro || schedules.length === 0) && (
          <AppButton
            title="Create New Schedule"
            onPress={handleAddNew}
            style={{ marginTop: 24 }}
          />
        )}

        {/* Toggles */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            24-Hour Time
          </Text>
          <Switch
            value={is24HourTime}
            onValueChange={setIs24HourTime}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.thumb}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.thumb}
          />
        </View>
        {/* Pro Debug Toggle - only show if in development */}
        {__DEV__ && (
          <View style={styles.settingRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Pro Mode (Dev Only)
            </Text>
            <Switch
              value={isPro}
              onValueChange={setIsPro}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.thumb}
            />
          </View>
        )}

        {/* Upgrade Button */}
        {!isPro && <AppButton title="Upgrade to Pro" onPress={handleUpgrade} />}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    paddingHorizontal: 24,
    alignItems: "stretch",
    paddingBottom: 48,
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
    padding: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  activeCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  savedSchedulesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    padding: 10,
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
