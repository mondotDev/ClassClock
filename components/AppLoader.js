// components/AppLoader.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function AppLoader({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  // Step 1: Fade In when component mounts
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Step 2: Wait for signal, then Fade Out and call onFinish
  useEffect(() => {
    if (onFinish) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        delay: 200, // tiny delay before fade-out
        useNativeDriver: true,
      }).start(() => {
        // Schedule onFinish after current execution context
        setTimeout(() => onFinish(), 0);
      });
    }
  }, [onFinish]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.colors.background, opacity: fadeAnim }]}>
      <Image
        source={require('../assets/icon.png')}
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
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
