import { supabaseAdmin } from '../lib/supabase.js';
import { extractWithHaiku } from './claude.service.js';

export async function generateThreadSummary(threadId: string): Promise<void> {
  // Get the thread info
  const { data: thread } = await supabaseAdmin
    .from('threads')
    .select('title, description, context_summary')
    .eq('id', threadId)
    .single();

  if (!thread) return;

  // Get the last 30 messages for context
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('role, content')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (!messages || messages.length < 10) return;

  const conversation = messages
    .reverse()
    .map((m) => `${m.role === 'user' ? 'User' : 'Amaia'}: ${m.content}`)
    .join('\n');

  const prompt = `Summarize this conversation thread for an AI companion's context.

Thread: "${thread.title}"
${thread.description ? `Description: ${thread.description}` : ''}
${thread.context_summary ? `Previous summary: ${thread.context_summary}` : ''}

Recent conversation:
${conversation}

Write a concise 2-4 sentence summary that captures:
1. The key topics discussed recently
2. The emotional direction (are they feeling better? worse? working through something?)
3. Any decisions made or next steps mentioned
4. The current "vibe" of the thread

Be warm and specific. This will be injected into the AI's context to help it stay grounded in what matters.

Return ONLY the summary text, nothing else.`;

  try {
    const summary = await extractWithHaiku(prompt);

    await supabaseAdmin
      .from('threads')
      .update({ context_summary: summary.trim() })
      .eq('id', threadId);
  } catch (err) {
    console.error('Thread summary generation failed:', err);
  }
}
