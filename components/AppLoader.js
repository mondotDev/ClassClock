import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function AppLoader({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    // Step 1: Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (onFinish) {
      // Step 2: Wait for a signal, then Fade Out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        delay: 200, // tiny delay before starting fade-out
        useNativeDriver: true,
      }).start(() => {
        onFinish(); // Tell MainNavigator we’re done
      });
    }
  }, [onFinish]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.colors.background, opacity: fadeAnim }]}>
      <Image
        source={require('../assets/icon.png')} // ⚡ Your branded icon
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // ensure it sits on top
  },
  logo: {
    width: 200,
    height: 200,
  },
});
