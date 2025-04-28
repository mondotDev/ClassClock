// screens/SettingsScreen.js

import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "../context/AppContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import useTheme from "../hooks/useTheme";

export default function SettingsScreen() {
  const { isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime } = useSettings();
  const navigation = useNavigation();
  const theme = useTheme(); // ✅ fixed here

  const [scheduleName, setScheduleName] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("@schedule")
      .then((json) => {
        if (json) {
          const data = JSON.parse(json);
          setScheduleName(data.name || "Unnamed Schedule");
        } else {
          setScheduleName(null);
        }
      })
      .catch(console.error);
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete your schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@schedule");
            setScheduleName(null);
          },
        },
      ]
    );
  };

  const handleAddNew = async () => {
    await AsyncStorage.removeItem("@schedule");
    await AsyncStorage.removeItem("@hasOnboarded");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ScheduleName" }],
      })
    );
  };

  const handleEdit = () => {
    Alert.alert(
      "Edit Schedule",
      "Editing schedules will be available in a future update."
    );
  };

  const handleUpgrade = () => {
    Alert.alert("Coming Soon", "Pro features coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Schedule Section */}
        {!scheduleName ? (
          <AppButton
            title="Add New Schedule"
            onPress={handleAddNew}
            style={styles.buttonMargin}
          />
        ) : (
          <View style={[styles.scheduleCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.scheduleText, { color: theme.colors.text }]}>
              Schedule: {scheduleName}
            </Text>
            <View style={styles.buttonsRow}>
              <Pressable
                onPress={handleEdit}
                style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
              >
                <Ionicons name="pencil" size={20} color={theme.colors.background} />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={[styles.iconButton, { backgroundColor: theme.colors.border }]}
              >
                <Ionicons name="trash" size={20} color={theme.colors.text} />
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
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={is24HourTime ? theme.colors.background : theme.colors.card}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={isDarkMode ? theme.colors.background : theme.colors.card}
          />
        </View>

        {/* Upgrade to Pro */}
        <AppButton
          title="Upgrade to Pro"
          onPress={handleUpgrade}
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
