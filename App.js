// App.js
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useState, useEffect, useCallback } from 'react';

import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import MainNavigator from './navigation/MainNavigator';
import ToastContainer from './components/ToastContainer';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font loading error:', e);
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
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <AppProvider>
          <MainNavigator />
          <ToastContainer />
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
