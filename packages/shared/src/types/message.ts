export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  thread_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  token_count: number | null;
  model_used: string | null;
  memories_used: string[];
  created_at: string;
}

export interface SendMessageRequest {
  thread_id: string;
  content: string;
}

export interface SendMessageResponse {
  user_message: Message;
  ai_message: Message;
  memories_used: number;
  gems_remaining: number;
}

export interface MessageHistoryResponse {
  messages: Message[];
  has_more: boolean;
  total: number;
}
