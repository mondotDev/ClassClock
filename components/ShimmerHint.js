import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShimmerHint({
  text = 'Swipe to continue →',
  shimmerAnim,
  shimmerFadeAnim,
  colors,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Animated.Text style={[styles.text, { color: colors.border, opacity: shimmerFadeAnim }]}>
          {text}
        </Animated.Text>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inner: {
    position: 'relative',
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  shimmerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
  },
  gradient: {
    width: 100,
    height: '100%',
  },
});
