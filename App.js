// App.js
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { AppProvider } from "./context/AppContext";
import MainNavigator from "./navigation/MainNavigator";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
          "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProvider>
        <ActionSheetProvider>
          {/* 🔥 Wrap MainNavigator + Toast inside a fragment <> </> */}
          <>
            <MainNavigator />
            <Toast />
          </>
        </ActionSheetProvider>
      </AppProvider>
    </View>
  );
}
