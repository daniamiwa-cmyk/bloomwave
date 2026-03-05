import { supabaseAdmin } from '../lib/supabase.js';
import type { RetrievedMemory } from '@amai/shared';

export async function searchMemories(
  queryEmbedding: number[],
  userId: string,
  threadId: string | null,
  topK: number = 8,
  threshold: number = 0.3,
): Promise<RetrievedMemory[]> {
  const { data, error } = await supabaseAdmin.rpc('match_memories', {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_thread_id: threadId,
    match_count: topK,
    match_threshold: threshold,
  });

  if (error) throw error;
  return data || [];
}

export async function saveMemory(memory: {
  user_id: string;
  thread_id: string | null;
  source_message_id: string | null;
  type: string;
  content: string;
  summary: string | null;
  relevance_score: number;
  emotional_weight: number;
  confidence: number;
  tags: string[];
  emotion: string;
  embedding: number[];
  profile_field: string | null;
  profile_value: unknown;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('memories').insert({
    user_id: memory.user_id,
    thread_id: memory.thread_id,
    source_message_id: memory.source_message_id,
    type: memory.type,
    content: memory.content,
    summary: memory.summary,
    relevance_score: memory.relevance_score,
    emotional_weight: memory.emotional_weight,
    confidence: memory.confidence,
    tags: memory.tags,
    emotion: memory.emotion,
    embedding: memory.embedding,
    profile_field: memory.profile_field,
    profile_value: memory.profile_value,
  });

  if (error) throw error;
}

export async function updateAccessCounts(memoryIds: string[]): Promise<void> {
  if (memoryIds.length === 0) return;

  for (const id of memoryIds) {
    const { data } = await supabaseAdmin
      .from('memories')
      .select('access_count')
      .eq('id', id)
      .single();

    if (data) {
      await supabaseAdmin
        .from('memories')
        .update({
          access_count: data.access_count + 1,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', id);
    }
  }
}
