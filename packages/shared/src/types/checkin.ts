export type CheckInStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type CheckInFrequency = 'once' | 'daily' | 'weekly' | 'custom';

export interface CheckIn {
  id: string;
  user_id: string;
  thread_id: string | null;
  topic: string;
  prompt_template: string | null;
  context: string | null;
  frequency: CheckInFrequency;
  scheduled_at: string;
  cron_expression: string | null;
  timezone: string;
  status: CheckInStatus;
  times_triggered: number;
  last_triggered_at: string | null;
  send_push: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCheckInRequest {
  topic: string;
  prompt_template?: string;
  context?: string;
  thread_id?: string;
  frequency: CheckInFrequency;
  scheduled_at: string;
  cron_expression?: string;
  timezone?: string;
  send_push?: boolean;
}
