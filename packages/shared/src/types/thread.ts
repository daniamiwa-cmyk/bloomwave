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
  persona_id: string | null;
  persona_name: string | null;
  persona_emoji: string | null;
  persona_slug: string | null;
  persona_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateThreadRequest {
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  persona_id?: string;
}

export interface UpdateThreadRequest {
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_archived?: boolean;
}
