// components/ShimmerHint.js

import React from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

export default function ShimmerHint({
  text = "Swipe to continue →",
  shimmerAnim,
  shimmerFadeAnim,
  colors,
  containerStyle = {},
}) {
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <Animated.View
      style={[
        styles.shimmerWrapper,
        containerStyle,
        { opacity: shimmerFadeAnim },
      ]}
    >
      <View style={{ overflow: "hidden" }}>
        <Animated.Text
          style={[
            styles.shimmerText,
            {
              color: colors.primary,
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shimmerWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  shimmerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
