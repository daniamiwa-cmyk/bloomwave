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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { purchaseGems, restorePurchases, isUserCancellation } from '@/services/purchases';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { GemProduct } from '@amai/shared';

export default function GemsScreen() {
  const [products, setProducts] = useState<GemProduct[]>([]);
  const [localizedPrices, setLocalizedPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const { profile, loadProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.get<{ products: GemProduct[] }>('/api/v1/gems/products');
      setProducts(data.products);

      // Fetch localized prices from RevenueCat
      try {
        const productIds = data.products.map((p) => p.product_id);
        const Purchases = require('react-native-purchases').default;
        const storeProducts = await Purchases.getProducts(productIds);
        const priceMap: Record<string, string> = {};
        for (const sp of storeProducts) {
          priceMap[sp.identifier] = sp.priceString;
        }
        setLocalizedPrices(priceMap);
      } catch {
        // Fall back to USD prices from backend
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: GemProduct) => {
    setPurchasing(product.product_id);
    try {
      const result = await purchaseGems(product.product_id);
      await loadProfile();
      Alert.alert(
        'Purchase complete!',
        `You received ${result.purchased} gems. Balance: ${result.gems}`,
      );
    } catch (err: any) {
      if (!isUserCancellation(err)) {
        Alert.alert('Purchase failed', err.message);
      }
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      Alert.alert('Restore complete', 'Your purchases have been restored.');
    } catch (err: any) {
      Alert.alert('Restore failed', err.message);
    }
  };

  const handleDailyClaim = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const result = await api.post<{ claimed: boolean; balance: number }>(
        '/api/v1/gems/daily',
      );
      await loadProfile();
      if (result.claimed) {
        Alert.alert('Daily gems claimed!', `You now have ${result.balance} gems.`);
      } else {
        Alert.alert('Come back tomorrow', "You've already claimed today's free gems.");
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gems</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance display */}
        <View style={styles.balanceCard}>
          <Ionicons name="diamond" size={32} color={colors.gem} />
          <Text style={styles.balanceCount}>{profile?.gems ?? 0}</Text>
          <Text style={styles.balanceLabel}>gems remaining</Text>
        </View>

        {/* Membership banner (shown only if user is already a member) */}
        {profile?.is_member && (
          <View style={styles.memberBadge}>
            <Ionicons name="star" size={18} color={colors.primary} />
            <Text style={styles.memberBadgeText}>Member — you get discounted gem prices</Text>
          </View>
        )}

        {/* Daily claim */}
        <TouchableOpacity style={[styles.dailyCard, claiming && { opacity: 0.6 }]} onPress={handleDailyClaim} disabled={claiming}>
          <Ionicons name="gift" size={24} color={colors.primary} />
          <View style={styles.dailyInfo}>
            <Text style={styles.dailyTitle}>Daily free gems</Text>
            <Text style={styles.dailyDesc}>Claim 10 gems every day</Text>
          </View>
          {claiming ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          )}
        </TouchableOpacity>

        {/* How gems work */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How gems work</Text>
          <Text style={styles.infoText}>Each message costs 1 gem. You get 10 free gems daily.</Text>
        </View>

        {/* Products */}
        <Text style={styles.shopTitle}>Get more gems</Text>
        <View style={styles.productGrid}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.product_id}
              style={[styles.productCard, product.is_popular && styles.productCardPopular]}
              onPress={() => handlePurchase(product)}
              disabled={purchasing === product.product_id}
            >
              {product.is_popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Best Value</Text>
                </View>
              )}
              <Ionicons name="diamond" size={28} color={colors.gem} />
              <Text style={styles.productGems}>{product.gems.toLocaleString()}</Text>
              <Text style={styles.productLabel}>{product.label}</Text>
              {purchasing === product.product_id ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.productPrice}>
                  {localizedPrices[product.product_id] || `$${product.price_usd}`}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  balanceCard: {
    alignItems: 'center',
    backgroundColor: colors.gem + '10',
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gem + '30',
  },
  balanceCount: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.gem,
    marginTop: spacing.sm,
  },
  balanceLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  dailyInfo: {
    flex: 1,
  },
  dailyTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  dailyDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  infoTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  shopTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  productCardPopular: {
    borderColor: colors.gem,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.gem,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  popularText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  productGems: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  productLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  productPrice: {
    ...typography.button,
    color: colors.primary,
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary + '10',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  memberBadgeText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  restoreText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
