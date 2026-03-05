import { supabaseAdmin } from '../lib/supabase.js';
import { InsufficientGemsError } from '../utils/errors.js';
import { GEM_COST_PER_MESSAGE, FREE_DAILY_GEMS } from '@amai/shared';
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
  const balance = await getBalance(userId);
  const newBalance = balance + amount;

  await supabaseAdmin
    .from('user_profiles')
    .update({ gems: newBalance })
    .eq('user_id', userId);

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

  if (hoursSinceLastClaim < 20) {
    return { claimed: false, balance: data.gems };
  }

  const newBalance = data.gems + FREE_DAILY_GEMS;

  await supabaseAdmin
    .from('user_profiles')
    .update({ gems: newBalance, last_free_gems_at: now.toISOString() })
    .eq('user_id', userId);

  await supabaseAdmin.from('gem_transactions').insert({
    user_id: userId,
    amount: FREE_DAILY_GEMS,
    type: 'bonus',
    description: 'Daily free gems',
  });

  return { claimed: true, balance: newBalance };
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
  const nonSubs = data.subscriber?.non_subscriptions ?? {};
  const productTransactions = nonSubs[productId] ?? [];

  return productTransactions.some(
    (t: any) => t.store_transaction_id === transactionId || t.id === transactionId,
  );
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
