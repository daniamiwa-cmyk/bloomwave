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

export async function configurePurchases(userId: string) {
  if (!API_KEY) {
    if (__DEV__) console.warn('[purchases] EXPO_PUBLIC_REVENUECAT_API_KEY is empty, skipping configure');
    return;
  }
  try {
    getPurchases().configure({
      apiKey: API_KEY,
      appUserID: userId,
    });
  } catch (err) {
    console.error('[purchases] Failed to configure RevenueCat:', err);
  }
}

export async function purchaseGems(
  productId: string,
): Promise<{ gems: number; purchased: number }> {
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

export async function restorePurchases() {
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
