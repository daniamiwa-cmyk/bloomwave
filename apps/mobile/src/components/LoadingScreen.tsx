import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

// Floating orb — a soft blurred circle that drifts up and down
function Orb({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}) {
  const drift = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    drift.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(drift.value, [0, 1], [0, -18]) }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: x,
          top: y,
        },
        style,
      ]}
    />
  );
}

// Twinkling dot — small sparkle
function Twinkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.out(Easing.back(2)) }),
          withTiming(0.3, { duration: 700, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <Animated.View
      style={[styles.twinkle, { left: x, top: y }, style]}
    />
  );
}

export function LoadingScreen() {
  // Logo pulse
  const logoPulse = useSharedValue(1);
  // Wordmark fade in
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkY = useSharedValue(8);
  // Tagline fade
  const taglineOpacity = useSharedValue(0);
  // Loading dots
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    // Logo gentle breathe
    logoPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    // Wordmark slides in
    wordmarkOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    wordmarkY.value = withDelay(200, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));

    // Tagline
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    // Bouncing dots
    const dotAnim = (val: Animated.SharedValue<number>, delay: number) => {
      val.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-6, { duration: 350, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) }),
            withTiming(0, { duration: 300 }),
          ),
          -1,
          false,
        ),
      );
    };
    dotAnim(dot1, 800);
    dotAnim(dot2, 1000);
    dotAnim(dot3, 1200);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoPulse.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const dotStyle = (val: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: val.value }],
    }));

  return (
    <View style={styles.container}>
      {/* Background orbs */}
      <Orb size={180} color={colors.primary + '18'} x={-40} y={60} delay={0} duration={3200} />
      <Orb size={120} color={colors.rose + '22'} x={220} y={120} delay={400} duration={2800} />
      <Orb size={90} color={colors.gem + '20'} x={40} y={480} delay={200} duration={3600} />
      <Orb size={70} color={colors.pink + '1A'} x={280} y={440} delay={600} duration={2600} />

      {/* Twinkles */}
      <Twinkle x={80} y={200} delay={900} />
      <Twinkle x={310} y={300} delay={1300} />
      <Twinkle x={150} y={520} delay={1100} />
      <Twinkle x={60} y={380} delay={1500} />
      <Twinkle x={340} y={180} delay={1700} />

      {/* Logo mark */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoGlyph}>✦</Text>
      </Animated.View>

      {/* Wordmark */}
      <Animated.Text style={[styles.wordmark, wordmarkStyle]}>
        amaia
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        someone who actually pays attention
      </Animated.Text>

      {/* Bouncing dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, dotStyle(dot1)]} />
        <Animated.View style={[styles.dot, dotStyle(dot2)]} />
        <Animated.View style={[styles.dot, dotStyle(dot3)]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
  },
  twinkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  logoWrap: {
    marginBottom: 12,
  },
  logoGlyph: {
    fontSize: 56,
    color: colors.primary,
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: 6,
    color: colors.text,
    marginBottom: 10,
  },
  tagline: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 48,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    height: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary + '70',
  },
});
