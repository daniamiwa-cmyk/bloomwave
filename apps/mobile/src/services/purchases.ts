import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import type { PurchasesError } from 'react-native-purchases';
import { api } from './api';

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';

export async function configurePurchases(userId: string) {
  Purchases.configure({
    apiKey: API_KEY,
    appUserID: userId,
  });
}

export async function purchaseGems(
  productId: string,
): Promise<{ gems: number; purchased: number }> {
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
  await Purchases.restorePurchases();
}

export function isUserCancellation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PurchasesError).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  );
}
