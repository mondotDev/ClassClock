// App.js

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useAppContext } from './context/AppContext';
import MainNavigator from './navigation/MainNavigator';
import { lightTheme, darkTheme } from './constants/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

function Root() {
  const { isDark } = useAppContext();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <MainNavigator />
    </NavigationContainer>
  );
}
