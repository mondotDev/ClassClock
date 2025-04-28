// navigation/MainNavigator.js

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ScheduleNameScreen from "../screens/onboarding/01-ScheduleNameScreen";
import PeriodTimesScreen from "../screens/onboarding/02-PeriodTimesScreen";
import BreakLunchScreen from "../screens/onboarding/03-BreakLunchScreen";
import ReviewScheduleScreen from "../screens/onboarding/04-ReviewScheduleScreen";
import SettingsScreen from "../screens/SettingsScreen"; // ⚡ <== New import!

// 🛠️ Create the Stack Navigator
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    async function loadOnboardingStatus() {
      try {
        const onboarded = await AsyncStorage.getItem("@hasOnboarded");
        setHasOnboarded(!!onboarded);
      } catch (error) {
        console.error("Failed to load onboarding status", error);
      } finally {
        setIsReady(true);
      }
    }
    loadOnboardingStatus();
  }, []);

  if (!isReady) {
    return null; // Could add a loader here if you want
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={hasOnboarded ? "Home" : "ScheduleName"}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ScheduleName" component={ScheduleNameScreen} />
        <Stack.Screen name="PeriodTimes" component={PeriodTimesScreen} />
        <Stack.Screen name="BreakLunch" component={BreakLunchScreen} />
        <Stack.Screen name="ReviewSchedule" component={ReviewScheduleScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
