import { supabaseAdmin } from '../lib/supabase.js';
import { InsufficientGemsError } from '../utils/errors.js';
import { GEM_COST_PER_MESSAGE, FREE_DAILY_GEMS } from '@alora/shared';

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
  const balance = await getBalance(userId);
  if (balance < amount) {
    throw new InsufficientGemsError(amount, balance);
  }

  const newBalance = balance - amount;

  await supabaseAdmin
    .from('user_profiles')
    .update({ gems: newBalance })
    .eq('user_id', userId);

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

export async function getProducts() {
  const { data } = await supabaseAdmin
    .from('gem_products')
    .select('*')
    .eq('is_active', true)
    .order('gems', { ascending: true });

  return data || [];
}
