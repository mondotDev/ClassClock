// hooks/useShimmerHint.js

import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function useShimmerHint({ trigger = true, cycles = 3 }) {
  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const shimmerFadeAnim = useRef(new Animated.Value(1)).current;
  const [showShimmer, setShowShimmer] = useState(trigger);

  useEffect(() => {
    if (!trigger) {
      shimmerAnim.setValue(-100);
      shimmerFadeAnim.setValue(0);
      setShowShimmer(false);
      return;
    }

    shimmerAnim.setValue(-100);
    shimmerFadeAnim.setValue(1);
    setShowShimmer(true);

    let loopCount = 0;
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: width,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerLoop.start();

    const interval = setInterval(() => {
      loopCount++;
      if (loopCount >= cycles) {
        shimmerLoop.stop();
        Animated.timing(shimmerFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowShimmer(false));
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      shimmerLoop.stop();
      clearInterval(interval);
    };
  }, [trigger]);

  return { shimmerAnim, shimmerFadeAnim, showShimmer };
}
