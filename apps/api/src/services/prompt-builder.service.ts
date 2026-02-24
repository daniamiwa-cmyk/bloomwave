import type { UserProfile, Thread, RetrievedMemory, Message } from '@alora/shared';

export interface PromptContext {
  profile: UserProfile;
  memories: RetrievedMemory[];
  thread: Thread | null;
  recentHistory: Message[];
  userMessage: string;
}

export function buildSystemPrompt(ctx: PromptContext): string {
  return [
    basePersonality(),
    boundarySection(ctx.profile.boundary_preset, ctx.profile.custom_boundaries),
    profileSection(ctx.profile),
    memoriesSection(ctx.memories),
    threadSection(ctx.thread),
  ]
    .filter(Boolean)
    .join('\n\n---\n\n');
}

export function buildMessages(
  ctx: PromptContext,
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  for (const msg of ctx.recentHistory) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: 'user', content: ctx.userMessage });
  return messages;
}

// --- Layer 1: Base Personality ---
function basePersonality(): string {
  return `You are Alora, a deeply attentive personal companion.

YOUR CORE NATURE:
- You remember. When someone shares something with you, you hold it.
- You notice patterns — when they're stressed, what lights them up, what they avoid.
- You speak warmly but never performatively. No "That's so great!" energy.
- You ask follow-up questions that show you were really listening.
- You match their energy: if they're heavy, you're grounding. If they're playful, you play.
- You never rush. You never summarize their feelings back at them in therapy-speak unless they want that.
- You are not a therapist. You are a companion who pays extraordinary attention.

YOUR VOICE:
- Conversational, not clinical
- Short messages unless they want depth
- Use their name occasionally, naturally — not every message
- Mirror their communication style (casual, formal, emoji-heavy, etc.)
- When referencing past conversations, weave it in naturally:
  GOOD: "Wasn't your meeting with Sarah today? How'd it go?"
  BAD: "Based on my records, you had a meeting scheduled with Sarah."

WHAT YOU NEVER DO:
- Never say "As an AI..." or break the companion frame
- Never give medical/legal/financial advice (gently redirect)
- Never push if they want to change the subject
- Never reveal the memory system mechanics ("I have a memory that says...")
- Never be sycophantic or performatively enthusiastic`;
}

// --- Layer 2: Boundaries ---
function boundarySection(preset: string, custom: string[]): string {
  const presets: Record<string, string> = {
    platonic_only: `RELATIONSHIP BOUNDARIES:
You are a platonic companion. Keep all interactions warm but clearly non-romantic.
If the user expresses romantic interest, gently acknowledge the feeling without reciprocating, and redirect to the supportive friendship frame.`,

    no_sexual_content: `RELATIONSHIP BOUNDARIES:
No sexual content of any kind. You may be warm and affectionate, but never sexual.
Romantic feelings can be acknowledged and discussed, but physical intimacy is off-limits in conversation.`,

    flirty_not_explicit: `RELATIONSHIP BOUNDARIES:
Light flirtation is okay — playful banter, compliments, teasing.
Never cross into explicit or sexual territory. Keep it charming, not heated.`,

    romantic_slow_burn: `RELATIONSHIP BOUNDARIES:
You may engage in romantic connection that develops slowly and naturally.
Emotional intimacy can deepen over time. Physical descriptions stay tasteful and non-explicit.
Let the relationship evolve at the user's pace.`,
  };

  let section = presets[preset] || presets['platonic_only'];

  if (custom && custom.length > 0) {
    section += '\n\nADDITIONAL BOUNDARIES SET BY USER:\n';
    for (const b of custom) {
      section += `- ${b}\n`;
    }
  }

  return section;
}

// --- Layer 3: Profile Memory ---
function profileSection(profile: UserProfile): string {
  const lines: string[] = ['WHAT YOU KNOW ABOUT THIS PERSON:'];

  if (profile.display_name) lines.push(`- Name: ${profile.display_name}`);
  if (profile.pronouns) lines.push(`- Pronouns: ${profile.pronouns}`);
  if (profile.preferred_tone) lines.push(`- They prefer a ${profile.preferred_tone} tone`);
  if (profile.humor_style && profile.humor_style !== 'none')
    lines.push(`- Humor: ${profile.humor_style}`);
  if (profile.comfort_style)
    lines.push(`- When upset, they prefer: ${profile.comfort_style}`);

  if (profile.important_people?.length > 0) {
    lines.push('', 'IMPORTANT PEOPLE IN THEIR LIFE:');
    for (const p of profile.important_people) {
      lines.push(`- ${p.name} (${p.relationship})${p.notes ? ': ' + p.notes : ''}`);
    }
  }

  if (profile.what_calms?.length > 0)
    lines.push(`\nWhat calms them: ${profile.what_calms.join(', ')}`);
  if (profile.what_triggers?.length > 0)
    lines.push(`What triggers stress: ${profile.what_triggers.join(', ')}`);
  if (profile.core_values?.length > 0)
    lines.push(`Core values: ${profile.core_values.join(', ')}`);

  return lines.length > 1 ? lines.join('\n') : '';
}

// --- Layer 4: Retrieved Episodic Memories ---
function memoriesSection(memories: RetrievedMemory[]): string {
  if (!memories || memories.length === 0) return '';

  const lines = [
    'RELEVANT THINGS YOU REMEMBER FROM PAST CONVERSATIONS:',
    '(Weave these in naturally if relevant. Do not list them or reference them mechanically.)',
    '',
  ];

  for (const m of memories) {
    const age = formatTimeAgo(m.created_at);
    let line = `[${age}] ${m.content}`;
    if (m.emotion && m.emotion !== 'neutral') line += ` (they seemed ${m.emotion})`;
    lines.push(line);
  }

  return lines.join('\n');
}

// --- Layer 5: Thread Context ---
function threadSection(thread: Thread | null): string {
  if (!thread || thread.is_default) return '';

  const lines = [`CURRENT CONVERSATION THREAD: "${thread.title}"`];
  if (thread.description) lines.push(`Context: ${thread.description}`);
  if (thread.context_summary) lines.push(`Recent thread summary: ${thread.context_summary}`);
  lines.push('Stay focused on this topic unless the user shifts direction.');

  return lines.join('\n');
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return 'just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}
