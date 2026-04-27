import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { purchaseSubscription, restorePurchases, isUserCancellation, ensureConfigured } from '@/services/purchases';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

const FEATURES = [
  { icon: 'diamond', label: '25 gems daily', sub: 'vs. 10 for free users', color: colors.gem },
  { icon: 'sparkles', label: '20% bonus on every purchase', sub: 'more gems for your money', color: colors.primaryLight },
  { icon: 'people', label: 'Exclusive companions', sub: 'Damon, Isolde, Jo + future drops', color: colors.rose },
  { icon: 'color-palette', label: 'Appearance customization', sub: 'accent colors & themes', color: colors.pink },
];

type Plan = 'monthly' | 'annual';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { profile, loadProfile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('annual');
  const [purchasing, setPurchasing] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState('$9.99');
  const [annualPrice, setAnnualPrice] = useState('$79.99');

  // Reanimated v4
  const shimmer = useSharedValue(0);
  const cardSlide = useSharedValue(40);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Entrance
    cardSlide.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) });
    cardOpacity.value = withTiming(1, { duration: 420 });

    // Hero shimmer pulse
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      ensureConfigured(profile?.user_id);
      const Purchases = require('react-native-purchases').default;
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all['Amaia_Subscriptions'] ?? offerings.current;
      if (!offering) return;
      for (const pkg of offering.availablePackages) {
        if (pkg.product.identifier === 'amaia_monthly') {
          setMonthlyPrice(pkg.product.priceString);
        } else if (pkg.product.identifier === 'amaia_annual') {
          setAnnualPrice(pkg.product.priceString);
        }
      }
    } catch {
      // keep defaults
    }
  };

  const handlePurchase = async () => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      await purchaseSubscription(selectedPlan === 'monthly' ? 'amaia_monthly' : 'amaia_annual');
      await loadProfile();
      Alert.alert(
        'Welcome to Amaia ✦',
        'Your membership is active. Enjoy your exclusive companions and extra gems.',
        [{ text: 'Let\'s go', onPress: () => router.back() }],
      );
    } catch (err: any) {
      if (!isUserCancellation(err)) {
        Alert.alert('Something went wrong', err.message);
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      await loadProfile();
      Alert.alert('Restored', 'Your purchases have been restored.');
    } catch (err: any) {
      Alert.alert('Restore failed', err.message);
    }
  };

  const heroStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.65, 1]),
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardSlide.value }],
  }));

  const annualMonthly = (parseFloat(annualPrice.replace(/[^0-9.]/g, '')) / 12).toFixed(2);
  const savePct = Math.round(
    (1 - parseFloat(annualPrice.replace(/[^0-9.]/g, '')) / (parseFloat(monthlyPrice.replace(/[^0-9.]/g, '')) * 12)) * 100,
  );

  if (profile?.is_member) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Membership</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.alreadyMember}>
          <Text style={{ fontSize: 48 }}>✦</Text>
          <Text style={[typography.h2, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
            You're a member
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }]}>
            All companion perks are unlocked.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <Text style={styles.heroGlyph}>✦</Text>
          <Text style={styles.heroTitle}>Amaia Member</Text>
          <Text style={styles.heroSub}>
            More gems. Exclusive companions.{'\n'}The full experience.
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View style={cardStyle}>
          <View style={styles.featureList}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: f.color + '18' }]}>
                  <Ionicons name={f.icon as any} size={18} color={f.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Plan selector */}
          <Text style={styles.sectionLabel}>Choose your plan</Text>
          <View style={styles.planRow}>
            {/* Annual */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('annual')}
              activeOpacity={0.8}
            >
              {savePct > 0 && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>Save {savePct}%</Text>
                </View>
              )}
              <Text style={styles.planName}>Annual</Text>
              <Text style={[styles.planPrice, selectedPlan === 'annual' && styles.planPriceSelected]}>
                {annualPrice}
              </Text>
              <Text style={styles.planPer}>/ year</Text>
              <Text style={styles.planMonthly}>${annualMonthly}/mo</Text>
            </TouchableOpacity>

            {/* Monthly */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
            >
              <Text style={styles.planName}>Monthly</Text>
              <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceSelected]}>
                {monthlyPrice}
              </Text>
              <Text style={styles.planPer}>/ month</Text>
              <Text style={styles.planMonthly}>{monthlyPrice}/mo</Text>
            </TouchableOpacity>
          </View>

          {/* Monthly gems note */}
          <View style={styles.gemsNote}>
            <Ionicons name="diamond" size={14} color={colors.gem} />
            <Text style={styles.gemsNoteText}>
              {selectedPlan === 'annual' ? '100' : '75'} bonus gems every month with your plan
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, purchasing && { opacity: 0.7 }]}
            onPress={handlePurchase}
            disabled={purchasing}
            activeOpacity={0.85}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.ctaText}>
                Start {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Membership
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.legalText}>
            Payment charged to your Apple ID at confirmation. Renews automatically.
            Cancel any time in Settings.
          </Text>

          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
            <Text style={styles.restoreBtnText}>Restore Purchases</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  alreadyMember: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  backBtnText: {
    ...typography.button,
    color: '#FFF',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  heroGlyph: {
    fontSize: 52,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heroSub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  featureSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  planRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
    paddingTop: spacing.lg,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  saveBadge: {
    position: 'absolute',
    top: -11,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  saveBadgeText: {
    ...typography.caption,
    color: '#FFF',
    fontWeight: '700',
  },
  planName: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  planPriceSelected: {
    color: colors.primary,
  },
  planPer: {
    ...typography.caption,
    color: colors.textMuted,
  },
  planMonthly: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  gemsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  gemsNoteText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ctaText: {
    ...typography.button,
    color: '#FFF',
  },
  legalText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  restoreBtn: {
    alignItems: 'center',
  },
  restoreBtnText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
