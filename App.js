// App.js
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { AppProvider } from "./context/AppContext";
import MainNavigator from "./navigation/MainNavigator";
import Toast from "react-native-toast-message";
import AppLoader from "./components/AppLoader"; // ✅ Add this line

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true); // ✅ Add this

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

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProvider>
          <>
            {/* 🔄 Show AppLoader briefly before navigator */}
            {showLoader ? (
              <AppLoader onFinish={() => setShowLoader(false)} />
            ) : (
              <>
                <MainNavigator />
                <Toast />
              </>
            )}
          </>
      </AppProvider>
    </View>
  );
}
