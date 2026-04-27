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

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err?.status ?? err?.statusCode;
      // Don't retry on client errors (4xx) except rate limits (429) and overloaded (529)
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err;
      }
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt) + Math.random() * 200;
        console.warn(`[${label}] Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

export async function chat(options: ChatOptions): Promise<ChatResult> {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    let response;
    try {
      response = await anthropic.messages.create(
        {
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
        },
        { signal: controller.signal },
      );
    } finally {
      clearTimeout(timeout);
    }

    const textBlock = response.content.find((b) => b.type === 'text');

    return {
      content: textBlock?.text || '',
      model: response.model,
      usage: response.usage,
    };
  }, 'claude.chat');
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

export { DEFAULT_MODEL, HAIKU_MODEL, withRetry };
