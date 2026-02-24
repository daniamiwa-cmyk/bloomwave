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
  label: string;
  is_popular: boolean;
}

export const GEM_COST_PER_MESSAGE = 1;
export const GEM_COST_DEEP_SESSION = 5;
export const FREE_DAILY_GEMS = 10;
