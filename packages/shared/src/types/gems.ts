export interface GemBalance {
  gems: number;
  user_id: string;
}

export interface GemTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: GemTransactionType;
  description: string;
  iap_product_id: string | null;
  iap_transaction_id: string | null;
  created_at: string;
}

export type GemTransactionType = 'purchase' | 'spend' | 'bonus' | 'refund';

export interface GemProduct {
  id: string;
  product_id: string;
  gems: number;
  price_usd: number;
  member_price_usd: number | null;
  label: string;
  is_popular: boolean;
}

export const GEM_COST_PER_MESSAGE = 1;
export const GEM_COST_DEEP_SESSION = 5;
export const FREE_DAILY_GEMS = 10;
export const MEMBER_DAILY_GEMS = 25;
export const MEMBER_GEM_BONUS_PCT = 0.20; // members get 20% bonus gems on every purchase

export interface SubscriptionProduct {
  id: string;
  product_id: string;
  label: string;
  interval: 'monthly' | 'annual';
  price_usd: number;
  monthly_gems: number;
  is_active: boolean;
}

export interface SubscriptionStatus {
  is_member: boolean;
  membership_type: string | null;
  membership_expires_at: string | null;
}
