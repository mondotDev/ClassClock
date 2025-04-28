import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { AppProvider } from "./context/AppContext";
import MainNavigator from "./navigation/MainNavigator";

SplashScreen.preventAutoHideAsync(); // Tell Expo to keep splash visible

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
          "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true); // App is ready!
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync(); // Hide splash after app is ready
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // While loading, show nothing (keeps splash up)
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProvider>
        <ActionSheetProvider>
          <MainNavigator />
        </ActionSheetProvider>
      </AppProvider>
    </View>
  );
}
