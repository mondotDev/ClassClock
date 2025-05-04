import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StepBadge({ step, totalSteps, colors, fadeAnim, translateAnim }) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          top: insets.top + 8,
          backgroundColor: colors.card,
          opacity: fadeAnim || 1,
          transform: [{ translateY: translateAnim || 0 }],
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>
        Step {step} of {totalSteps}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    zIndex: 10,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
});
