import { anthropic } from '../lib/anthropic.js';
import type { FastifyReply } from 'fastify';

interface StreamOptions {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
  onToken?: (token: string) => void;
  onDone?: (fullText: string, usage: { input_tokens: number; output_tokens: number }) => void;
}

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';

export async function streamChat(
  reply: FastifyReply,
  options: StreamOptions,
): Promise<void> {
  // Set SSE headers (skip if already sent by caller)
  if (!reply.raw.headersSent) {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
  }

  let fullText = '';
  let usage = { input_tokens: 0, output_tokens: 0 };

  try {
    const stream = anthropic.messages.stream({
      model: DEFAULT_MODEL,
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

    // Abort the Anthropic stream if the client disconnects (saves tokens)
    reply.raw.on('close', () => stream.abort());

    stream.on('text', (text) => {
      fullText += text;
      // Send each token as an SSE event
      if (!reply.raw.destroyed) {
        reply.raw.write(`data: ${JSON.stringify({ type: 'token', text })}\n\n`);
      }
      options.onToken?.(text);
    });

    const finalMessage = await stream.finalMessage();
    usage = finalMessage.usage;

    // Send completion event
    if (!reply.raw.destroyed) {
      reply.raw.write(
        `data: ${JSON.stringify({
          type: 'done',
          full_text: fullText,
          usage,
        })}\n\n`,
      );
    }

    options.onDone?.(fullText, usage);
  } catch (err: any) {
    if (!reply.raw.destroyed) {
      reply.raw.write(
        `data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`,
      );
    }
  } finally {
    if (!reply.raw.destroyed) {
      reply.raw.end();
    }
  }
}
