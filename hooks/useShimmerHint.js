// hooks/useShimmerHint.js
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export default function useShimmerHint({ trigger = true, cycles = 2 }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const shimmerFadeAnim = useRef(new Animated.Value(1)).current;
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const timeout = setTimeout(() => {
      setShowShimmer(true);

      let cycleCount = 0;
      const shimmerLoop = () => {
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ]).start(() => {
          cycleCount++;
          if (cycleCount < cycles) {
            shimmerLoop();
          } else {
            Animated.timing(shimmerFadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => setShowShimmer(false));
          }
        });
      };

      shimmerLoop();
    }, 0);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return { shimmerAnim, shimmerFadeAnim, showShimmer };
}