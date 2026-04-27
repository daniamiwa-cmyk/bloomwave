import type { PurchasesError } from 'react-native-purchases';
import { api } from './api';

// Lazy-load react-native-purchases to avoid TurboModule initialization at bundle load time
function getPurchases() {
  return require('react-native-purchases').default as typeof import('react-native-purchases').default;
}

function getPurchasesErrorCode() {
  return require('react-native-purchases').PURCHASES_ERROR_CODE as typeof import('react-native-purchases').PURCHASES_ERROR_CODE;
}

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';
let configured = false;

/**
 * Ensures RevenueCat is configured. Safe to call multiple times.
 * Called lazily on first purchase/product fetch, not at app startup.
 */
export function ensureConfigured(userId?: string) {
  if (configured || !API_KEY) return;
  try {
    getPurchases().configure({
      apiKey: API_KEY,
      ...(userId ? { appUserID: userId } : {}),
    });
    configured = true;
  } catch (err) {
    console.error('[purchases] Failed to configure RevenueCat:', err);
  }
}

export async function purchaseGems(
  productId: string,
): Promise<{ gems: number; purchased: number }> {
  ensureConfigured();
  const Purchases = getPurchases();
  const products = await Purchases.getProducts([productId]);
  if (products.length === 0) {
    throw new Error('Product not found in store');
  }

  const { transaction, customerInfo } = await Purchases.purchaseStoreProduct(
    products[0],
  );

  // Use the transaction ID directly from the purchase result
  let transactionId = transaction?.transactionIdentifier ?? '';

  // Fallback: find the most recent transaction for this product
  if (!transactionId) {
    const nonSubs = customerInfo.nonSubscriptionTransactions;
    const matching = nonSubs
      .filter((t) => t.productIdentifier === productId)
      .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
    transactionId = matching[0]?.transactionIdentifier ?? '';
  }

  if (!transactionId) {
    throw new Error('Could not determine transaction ID for this purchase');
  }

  if (__DEV__) {
    console.log('[purchases] transactionId:', transactionId, 'productId:', productId);
  }

  // Server verifies and credits gems
  const result = await api.post<{ gems: number; purchased: number }>(
    '/api/v1/gems/purchase',
    {
      product_id: productId,
      transaction_id: transactionId,
    },
  );

  return result;
}

export async function purchaseSubscription(
  productId: 'amaia_monthly' | 'amaia_annual',
): Promise<{ is_member: boolean; membership_type: string }> {
  ensureConfigured();
  const Purchases = getPurchases();

  const offerings = await Purchases.getOfferings();
  const subscriptionOffering = offerings.all['Amaia_Subscriptions'] ?? offerings.current;

  if (!subscriptionOffering) {
    throw new Error('Subscription offering not available');
  }

  const pkg = subscriptionOffering.availablePackages.find(
    (p) => p.product.identifier === productId,
  );

  if (!pkg) {
    throw new Error(`Subscription product not found: ${productId}`);
  }

  await Purchases.purchasePackage(pkg);

  // Server reads subscription status directly from RevenueCat via webhook;
  // return optimistic status — the UI should refetch profile to confirm.
  return { is_member: true, membership_type: productId };
}

export async function getSubscriptionStatus(): Promise<{
  is_member: boolean;
  membership_type: string | null;
}> {
  ensureConfigured();
  const Purchases = getPurchases();
  const info = await Purchases.getCustomerInfo();

  const activeEntitlements = Object.keys(info.entitlements.active);
  const isMember = activeEntitlements.includes('Alora Pro');

  const activeSubs = info.activeSubscriptions;
  const membershipType = activeSubs.find(
    (s) => s === 'amaia_monthly' || s === 'amaia_annual',
  ) ?? null;

  return { is_member: isMember, membership_type: membershipType };
}

export async function restorePurchases() {
  ensureConfigured();
  await getPurchases().restorePurchases();
}

export function isUserCancellation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PurchasesError).code === getPurchasesErrorCode().PURCHASE_CANCELLED_ERROR
  );
}
