import { EmotionalTone } from '../constants/emotions';

export type MemoryType = 'episodic' | 'profile_update';

export interface Memory {
  id: string;
  user_id: string;
  thread_id: string | null;
  source_message_id: string | null;
  type: MemoryType;
  content: string;
  summary: string | null;
  relevance_score: number;
  emotional_weight: number;
  confidence: number;
  access_count: number;
  last_accessed_at: string | null;
  tags: string[];
  emotion: EmotionalTone;
  is_pinned: boolean;
  is_hidden: boolean;
  user_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface RetrievedMemory extends Memory {
  similarity: number;
}

export interface MemoryCandidate {
  content: string;
  summary: string;
  type: MemoryType;
  emotion: EmotionalTone;
  tags: string[];
  relevance_score: number;
  emotional_weight: number;
  confidence: number;
  profile_field: string | null;
  profile_value: unknown;
}

export interface MemoryListResponse {
  memories: Memory[];
  has_more: boolean;
  total: number;
}
