-- Unique partial index to prevent duplicate webhook gem credits
-- NULL values are excluded (most transactions don't have iap_transaction_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_gem_transactions_iap_txn_unique
  ON public.gem_transactions(iap_transaction_id)
  WHERE iap_transaction_id IS NOT NULL;

-- Add updated_at trigger to device_tokens (was missing)
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add missing indexes for query performance
CREATE INDEX IF NOT EXISTS idx_content_reports_thread_id
  ON public.content_reports(thread_id);

CREATE INDEX IF NOT EXISTS idx_persona_requests_status
  ON public.persona_requests(status);
