import { supabaseAdmin } from '../lib/supabase.js';
import * as claude from './claude.service.js';
import * as promptBuilder from './prompt-builder.service.js';
import * as embeddingService from './embedding.service.js';
import * as memoryRetrieval from './memory-retrieval.service.js';
import * as memoryExtraction from './memory-extraction.service.js';
import * as profileService from './profile.service.js';
import * as gemsService from './gems.service.js';
import type { Message, SendMessageResponse } from '@alora/shared';
import { GEM_COST_PER_MESSAGE } from '@alora/shared';

export async function sendMessage(
  userId: string,
  threadId: string,
  content: string,
): Promise<SendMessageResponse> {
  // 1. Spend gems
  const gemsRemaining = await gemsService.spendForMessage(userId);

  // 2. Save user message
  const userMessage = await saveMessage(threadId, userId, 'user', content);

  // 3. Embed user message + retrieve memories (parallel)
  const [queryEmbedding, profile, thread, recentHistory] = await Promise.all([
    embeddingService.embed(content),
    profileService.getProfile(userId),
    getThread(threadId),
    getRecentMessages(threadId, 10),
  ]);

  // 4. Search memories (needs embedding from step 3)
  const memories = profile.memory_paused
    ? []
    : await memoryRetrieval.searchMemories(queryEmbedding, userId, threadId);

  // 5. Build prompt
  const systemPrompt = promptBuilder.buildSystemPrompt({
    profile,
    memories,
    thread,
    recentHistory,
    userMessage: content,
  });

  const messages = promptBuilder.buildMessages({
    profile,
    memories,
    thread,
    recentHistory,
    userMessage: content,
  });

  // 6. Call Claude
  const aiResult = await claude.chat({
    systemPrompt,
    messages,
  });

  // 7. Save AI response
  const aiMessage = await saveMessage(threadId, userId, 'assistant', aiResult.content, {
    tokenCount: aiResult.usage.output_tokens,
    modelUsed: aiResult.model,
    memoriesUsed: memories.map((m) => m.id),
  });

  // 8. Update thread stats
  await supabaseAdmin
    .from('threads')
    .update({
      last_message_at: new Date().toISOString(),
      message_count: thread ? thread.message_count + 2 : 2,
    })
    .eq('id', threadId);

  // 9. Async: extract memories (don't block response)
  if (!profile.memory_paused) {
    extractMemoriesAsync(userId, threadId, content, aiResult.content, userMessage.id, profile);
  }

  // 10. Async: update access counts
  if (memories.length > 0) {
    memoryRetrieval.updateAccessCounts(memories.map((m) => m.id)).catch(() => {});
  }

  return {
    user_message: userMessage,
    ai_message: aiMessage,
    memories_used: memories.length,
    gems_remaining: gemsRemaining,
  };
}

export async function getMessageHistory(
  threadId: string,
  page: number = 0,
  limit: number = 30,
) {
  const offset = page * limit;

  const { data, error, count } = await supabaseAdmin
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    messages: data || [],
    has_more: (count || 0) > offset + limit,
    total: count || 0,
  };
}

// --- Helpers ---

async function saveMessage(
  threadId: string,
  userId: string,
  role: string,
  content: string,
  meta?: { tokenCount?: number; modelUsed?: string; memoriesUsed?: string[] },
): Promise<Message> {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({
      thread_id: threadId,
      user_id: userId,
      role,
      content,
      token_count: meta?.tokenCount || null,
      model_used: meta?.modelUsed || null,
      memories_used: meta?.memoriesUsed || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

async function getThread(threadId: string) {
  const { data } = await supabaseAdmin
    .from('threads')
    .select('*')
    .eq('id', threadId)
    .single();
  return data;
}

async function getRecentMessages(threadId: string, limit: number): Promise<Message[]> {
  const { data } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []).reverse() as Message[];
}

async function extractMemoriesAsync(
  userId: string,
  threadId: string,
  userMessage: string,
  aiResponse: string,
  sourceMessageId: string,
  profile: ReturnType<typeof profileService.getProfile> extends Promise<infer T> ? T : never,
) {
  try {
    const candidates = await memoryExtraction.extractMemories(userMessage, aiResponse, profile);
    const worthy = candidates.filter((c) => c.confidence > 0.4);

    for (const candidate of worthy) {
      const embedding = await embeddingService.embed(candidate.content);

      await memoryRetrieval.saveMemory({
        user_id: userId,
        thread_id: threadId,
        source_message_id: sourceMessageId,
        type: candidate.type,
        content: candidate.content,
        summary: candidate.summary,
        relevance_score: candidate.relevance_score,
        emotional_weight: candidate.emotional_weight,
        confidence: candidate.confidence,
        tags: candidate.tags,
        emotion: candidate.emotion,
        embedding,
        profile_field: candidate.profile_field,
        profile_value: candidate.profile_value,
      });

      // Auto-merge high confidence profile updates
      if (candidate.type === 'profile_update' && candidate.confidence > 0.8 && candidate.profile_field) {
        await profileService.mergeProfileUpdate(userId, candidate.profile_field, candidate.profile_value);
      }
    }
  } catch (err) {
    console.error('Memory extraction failed (non-blocking):', err);
  }
}
