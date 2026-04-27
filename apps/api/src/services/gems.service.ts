import { supabaseAdmin } from '../lib/supabase.js';
import { InsufficientGemsError } from '../utils/errors.js';
// Inlined from @amai/shared — ESM/CJS interop prevents named imports of constants
const GEM_COST_PER_MESSAGE = 1;
const FREE_DAILY_GEMS = 10;
const MEMBER_DAILY_GEMS = 25;
const MEMBER_GEM_BONUS_PCT = 0.20;
import { env } from '../config/env.js';

export async function getBalance(userId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('gems')
    .eq('user_id', userId)
    .single();

  return data?.gems ?? 0;
}

export async function spendGems(
  userId: string,
  amount: number,
  description: string,
): Promise<number> {
  // Atomic decrement: only succeeds if balance >= amount
  const { data, error } = await supabaseAdmin.rpc('spend_gems', {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error || data === null) {
    // Fallback: check balance for error message
    const balance = await getBalance(userId);
    if (balance < amount) {
      throw new InsufficientGemsError(amount, balance);
    }
    throw error || new Error('Failed to spend gems');
  }

  const newBalance = data as number;

  await supabaseAdmin.from('gem_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'spend',
    description,
  });

  return newBalance;
}

export async function addGems(
  userId: string,
  amount: number,
  type: 'purchase' | 'bonus' | 'refund',
  description: string,
  iapProductId?: string,
  iapTransactionId?: string,
): Promise<number> {
  // Atomic increment to prevent race conditions with concurrent purchases
  const { data, error } = await supabaseAdmin.rpc('add_gems', {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error || data === null) {
    throw error || new Error('Failed to add gems');
  }

  const newBalance = data as number;

  await supabaseAdmin.from('gem_transactions').insert({
    user_id: userId,
    amount,
    type,
    description,
    iap_product_id: iapProductId || null,
    iap_transaction_id: iapTransactionId || null,
  });

  return newBalance;
}

export async function claimDailyGems(userId: string): Promise<{ claimed: boolean; balance: number }> {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('gems, last_free_gems_at')
    .eq('user_id', userId)
    .single();

  if (!data) return { claimed: false, balance: 0 };

  const lastClaim = data.last_free_gems_at ? new Date(data.last_free_gems_at) : new Date(0);
  const now = new Date();
  const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / 3600000;

  if (hoursSinceLastClaim < 24) {
    return { claimed: false, balance: data.gems };
  }

  // Members get more daily gems
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('is_member')
    .eq('user_id', userId)
    .single();
  const dailyAmount = profile?.is_member ? MEMBER_DAILY_GEMS : FREE_DAILY_GEMS;

  // Atomic claim: only update last_free_gems_at if it hasn't changed (prevents concurrent claims)
  const cutoff = new Date(now.getTime() - 24 * 3600000).toISOString();
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({ last_free_gems_at: now.toISOString() })
    .eq('user_id', userId)
    .or(`last_free_gems_at.is.null,last_free_gems_at.lt.${cutoff}`)
    .select('user_id')
    .maybeSingle();

  if (updateError) throw updateError;

  // If no row was updated, another request already claimed
  if (!updated) {
    return { claimed: false, balance: data.gems };
  }

  // Atomic increment for daily gems
  const { data: newBalance, error: rpcError } = await supabaseAdmin.rpc('add_gems', {
    p_user_id: userId,
    p_amount: dailyAmount,
  });

  if (rpcError) throw rpcError;

  await supabaseAdmin.from('gem_transactions').insert({
    user_id: userId,
    amount: dailyAmount,
    type: 'bonus',
    description: profile?.is_member ? 'Daily member gems' : 'Daily free gems',
  });

  return { claimed: true, balance: newBalance as number };
}

export async function spendForMessage(userId: string): Promise<number> {
  return spendGems(userId, GEM_COST_PER_MESSAGE, 'Chat message');
}

export async function verifyRevenueCatTransaction(
  userId: string,
  transactionId: string,
  productId: string,
): Promise<boolean> {
  if (!env.REVENUECAT_SECRET_KEY) {
    if (env.NODE_ENV === 'production') {
      throw new Error('REVENUECAT_SECRET_KEY is required in production');
    }
    // In dev without a key, skip verification
    return true;
  }

  const res = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${env.REVENUECAT_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  const subscriber = data.subscriber ?? {};

  // Check non-subscription (consumable) purchases
  const nonSubs = subscriber.non_subscriptions ?? {};
  const productTransactions = nonSubs[productId] ?? [];
  if (productTransactions.some(
    (t: any) => t.store_transaction_id === transactionId || t.id === transactionId,
  )) {
    return true;
  }

  // Also check subscriptions (for subscription product verification)
  const subs = subscriber.subscriptions ?? {};
  const subEntry = subs[productId];
  if (subEntry && (subEntry.store_transaction_id === transactionId || subEntry.original_purchase_server_notification_id === transactionId)) {
    return true;
  }

  return false;
}

export async function checkTransactionProcessed(transactionId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('gem_transactions')
    .select('id')
    .eq('iap_transaction_id', transactionId)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

export async function checkRefundProcessed(transactionId: string): Promise<boolean> {
  const refundId = `refund-${transactionId}`;
  return checkTransactionProcessed(refundId);
}

export async function getProducts() {
  const { data } = await supabaseAdmin
    .from('gem_products')
    .select('*')
    .eq('is_active', true)
    .order('gems', { ascending: true });

  return data || [];
}

export async function getSubscriptionProducts() {
  const { data } = await supabaseAdmin
    .from('subscription_products')
    .select('*')
    .eq('is_active', true)
    .order('price_usd', { ascending: true });

  return data || [];
}

export async function getSubscriptionStatus(userId: string) {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('is_member, membership_type, membership_expires_at')
    .eq('user_id', userId)
    .single();

  return {
    is_member: data?.is_member ?? false,
    membership_type: data?.membership_type ?? null,
    membership_expires_at: data?.membership_expires_at ?? null,
  };
}

/**
 * Calculates how many gems to credit for a purchase.
 * Members receive a 20% bonus on top of the product's base gems.
 */
export async function gemsForPurchase(userId: string, baseGems: number): Promise<number> {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('is_member')
    .eq('user_id', userId)
    .single();

  if (data?.is_member) {
    return Math.floor(baseGems * (1 + MEMBER_GEM_BONUS_PCT));
  }
  return baseGems;
}
