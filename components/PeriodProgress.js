import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function PeriodProgress({ currentIndex, total, progressAnim, colors, pulseAnim }) {
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <Animated.Text
        style={[
          styles.stepper,
          { color: colors.text, transform: [{ scale: pulseAnim }] },
        ]}
      >
        Class {currentIndex + 1} of {total}
      </Animated.Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]} />
        <Animated.View
          style={[
            styles.progressIndicator,
            {
              backgroundColor: colors.primary,
              transform: [{ scaleX: progressAnim }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'transparent',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    opacity: 0.3,
  },
  progressIndicator: {
    height: 8,
    borderRadius: 4,
  },
});
