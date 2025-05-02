import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function FuseProgressBar({ startTime, endTime }) {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const totalDuration = endTime - startTime;
    const now = new Date();
    const elapsed = now - startTime;
    const initialProgress = Math.max(0, Math.min(1, elapsed / totalDuration));
    progressAnim.setValue(initialProgress);

    const remaining = endTime - now;

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: remaining,
      useNativeDriver: false,
    }).start();
  }, [startTime, endTime]);

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
