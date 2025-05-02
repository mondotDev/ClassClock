import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function FuseProgressBar({ totalMinutes, minutesLeft }) {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(1);

  const progress = totalMinutes > 0 ? minutesLeft / totalMinutes : 0;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    // Animate smoothly to new progress
    Animated.timing(progressAnim, {
      toValue: clampedProgress,
      duration: 500,
      useNativeDriver: false, // ❗ must be false for `width`
    }).start();
    prevProgress.current = clampedProgress;
  }, [clampedProgress]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
      <Animated.View
        style={[
          styles.barFill,
          {
            backgroundColor: colors.primary,
            width: animatedWidth,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
