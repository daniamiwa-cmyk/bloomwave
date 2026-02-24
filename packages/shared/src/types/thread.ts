export interface Thread {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  color: string;
  icon: string;
  is_default: boolean;
  is_archived: boolean;
  context_summary: string | null;
  last_message_at: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateThreadRequest {
  title: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateThreadRequest {
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_archived?: boolean;
}
