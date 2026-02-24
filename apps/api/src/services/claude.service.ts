import { anthropic } from '../lib/anthropic.js';

interface ChatOptions {
  model?: string;
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}

interface ChatResult {
  content: string;
  model: string;
  usage: { input_tokens: number; output_tokens: number };
}

const DEFAULT_MODEL = 'claude-sonnet-4-5-20241022';
const HAIKU_MODEL = 'claude-haiku-4-5-20241022';

export async function chat(options: ChatOptions): Promise<ChatResult> {
  const response = await anthropic.messages.create({
    model: options.model || DEFAULT_MODEL,
    max_tokens: options.maxTokens || 1024,
    system: [
      {
        type: 'text',
        text: options.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: options.messages,
  });

  const textBlock = response.content.find((b) => b.type === 'text');

  return {
    content: textBlock?.text || '',
    model: response.model,
    usage: response.usage,
  };
}

export async function extractWithHaiku(prompt: string): Promise<string> {
  const result = await chat({
    model: HAIKU_MODEL,
    systemPrompt: 'You are a precise JSON extraction system. Return only valid JSON.',
    messages: [{ role: 'user', content: prompt }],
    maxTokens: 1024,
  });
  return result.content;
}

export { DEFAULT_MODEL, HAIKU_MODEL };
