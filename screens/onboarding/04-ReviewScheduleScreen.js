import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AppButton from '../../components/AppButton';
import useTheme from '../../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReviewScheduleScreen({ navigation, route }) {
  const {
    scheduleName,
    selectedDays,
    hasZeroPeriod,
    numPeriods,
    periods,
    hasBreak,
    hasLunch,
    breakStartTime,
    breakEndTime,
    lunchStartTime,
    lunchEndTime,
  } = route.params;

  const { colors } = useTheme();

  const handleFinish = () => {
    navigation.replace('Home');
  };

  // Animation refs for period cards
  const fadeAnims = useRef(periods.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(periods.map(() => new Animated.Value(20))).current;

  // Shimmer animation for "scroll to see more"
  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const shimmerFade = useRef(new Animated.Value(1)).current;
  const [showShimmer, setShowShimmer] = useState(periods.length > 4);

  // Trigger card animations
  useEffect(() => {
    const animations = periods.map((_, i) =>
      Animated.parallel([
        Animated.timing(fadeAnims[i], {
          toValue: 1,
          duration: 400,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[i], {
          toValue: 0,
          duration: 400,
          delay: i * 100,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(100, animations).start();
  }, []);

  // Trigger shimmer animation
  useEffect(() => {
    if (!showShimmer) return;

    let loopCount = 0;
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 300,
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
      if (loopCount >= 3) {
        shimmerLoop.stop();
        Animated.timing(shimmerFade, {
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
  }, [showShimmer]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (showShimmer) {
      Animated.timing(shimmerFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowShimmer(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Review Your Schedule
        </Text>

        <View style={styles.section}>
          <Text style={[styles.metaText, { color: colors.text }]}>
            <Text style={styles.metaLabel}>Name: </Text>
            {scheduleName}
          </Text>
          <Text style={[styles.metaText, { color: colors.text }]}>
            <Text style={styles.metaLabel}>Days: </Text>
            {selectedDays.join(', ')}
          </Text>
          <Text style={[styles.metaText, { color: colors.text }]}>
            <Text style={styles.metaLabel}>Zero Period: </Text>
            {hasZeroPeriod ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.metaText, { color: colors.text }]}>
            <Text style={styles.metaLabel}>Number of Periods: </Text>
            {numPeriods}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Your Periods</Text>

        {periods.length > 4 && (
          <View style={{ height: 22, alignItems: 'center', marginBottom: 4 }}>
            <Animated.Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: colors.border,
                opacity: shimmerFade,
              }}
            >
              Scroll to see the rest ↓
            </Animated.Text>
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '100%',
                transform: [{ translateX: shimmerAnim }],
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ width: 100, height: '100%' }}
              />
            </Animated.View>
          </View>
        )}

        {periods.map((p, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                opacity: fadeAnims[index],
                transform: [{ translateY: slideAnims[index] }],
              },
            ]}
          >
            <Text style={[styles.periodLabel, { color: colors.text }]}>{p.label}</Text>
            <Text style={[styles.periodTime, { color: colors.text }]}>
              {p.startTime} – {p.endTime}
            </Text>
          </Animated.View>
        ))}

        {(hasBreak || hasLunch) && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Breaks & Lunch</Text>

            {hasBreak && (
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.periodLabel, { color: colors.text }]}>Break</Text>
                <Text style={[styles.periodTime, { color: colors.text }]}>
                  {breakStartTime} – {breakEndTime}
                </Text>
              </View>
            )}

            {hasLunch && (
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.periodLabel, { color: colors.text }]}>Lunch</Text>
                <Text style={[styles.periodTime, { color: colors.text }]}>
                  {lunchStartTime} – {lunchEndTime}
                </Text>
              </View>
            )}
          </>
        )}

        <AppButton title="Finish" onPress={handleFinish} style={{ marginTop: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 16,
    marginBottom: 8,
  },
  metaLabel: {
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  periodLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  periodTime: {
    fontSize: 16,
  },
});
