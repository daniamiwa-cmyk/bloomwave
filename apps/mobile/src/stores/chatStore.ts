import { create } from 'zustand';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import type { Message, SendMessageResponse, MessageHistoryResponse, Thread } from '@alora/shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ChatState {
  threads: Thread[];
  currentThreadId: string | null;
  messages: Message[];
  streamingText: string;
  isTyping: boolean;
  isLoadingHistory: boolean;
  hasMore: boolean;
  gemsRemaining: number;

  loadThreads: () => Promise<void>;
  setCurrentThread: (threadId: string) => void;
  loadMessages: (threadId: string, page?: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendMessageStreaming: (content: string) => Promise<void>;
  createThread: (title: string, description?: string) => Promise<Thread>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],
  currentThreadId: null,
  messages: [],
  streamingText: '',
  isTyping: false,
  isLoadingHistory: false,
  hasMore: false,
  gemsRemaining: 0,

  loadThreads: async () => {
    const { threads } = await api.get<{ threads: Thread[] }>('/api/v1/threads');
    set({ threads });
  },

  setCurrentThread: (threadId) => {
    set({ currentThreadId: threadId, messages: [], hasMore: false });
    get().loadMessages(threadId);
  },

  loadMessages: async (threadId, page = 0) => {
    set({ isLoadingHistory: true });
    const data = await api.get<MessageHistoryResponse>(
      `/api/v1/chat/${threadId}/history?page=${page}&limit=30`,
    );

    if (page === 0) {
      set({ messages: data.messages, hasMore: data.has_more, isLoadingHistory: false });
    } else {
      set((state) => ({
        messages: [...data.messages, ...state.messages],
        hasMore: data.has_more,
        isLoadingHistory: false,
      }));
    }
  },

  // Non-streaming fallback
  sendMessage: async (content) => {
    const { currentThreadId } = get();
    if (!currentThreadId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      thread_id: currentThreadId,
      user_id: '',
      role: 'user',
      content,
      token_count: null,
      model_used: null,
      memories_used: [],
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticMsg],
      isTyping: true,
    }));

    try {
      const response = await api.post<SendMessageResponse>('/api/v1/chat/send', {
        thread_id: currentThreadId,
        content,
      });

      set((state) => ({
        messages: [
          ...state.messages.filter((m) => m.id !== tempId),
          response.user_message,
          response.ai_message,
        ],
        isTyping: false,
        gemsRemaining: response.gems_remaining,
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempId),
        isTyping: false,
      }));
      throw error;
    }
  },

  // Streaming via SSE
  sendMessageStreaming: async (content) => {
    const { currentThreadId } = get();
    if (!currentThreadId) return;

    // Optimistic user message
    const tempUserId = `temp-user-${Date.now()}`;
    const tempAiId = `temp-ai-${Date.now()}`;

    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: tempUserId,
          thread_id: currentThreadId,
          user_id: '',
          role: 'user' as const,
          content,
          token_count: null,
          model_used: null,
          memories_used: [],
          created_at: new Date().toISOString(),
        },
      ],
      isTyping: true,
      streamingText: '',
    }));

    try {
      // Get auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ thread_id: currentThreadId, content }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Stream failed' }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream reader');

      const decoder = new TextDecoder();
      let streamedText = '';
      let userMessageId = tempUserId;

      // Add placeholder AI message
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: tempAiId,
            thread_id: currentThreadId,
            user_id: '',
            role: 'assistant' as const,
            content: '',
            token_count: null,
            model_used: null,
            memories_used: [],
            created_at: new Date().toISOString(),
          },
        ],
        isTyping: false,
      }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          try {
            const event = JSON.parse(data);

            if (event.type === 'meta') {
              userMessageId = event.user_message_id || tempUserId;
              set({ gemsRemaining: event.gems_remaining });
            } else if (event.type === 'token') {
              streamedText += event.text;
              // Update the placeholder AI message with accumulated text
              set((state) => ({
                messages: state.messages.map((m) =>
                  m.id === tempAiId ? { ...m, content: streamedText } : m,
                ),
                streamingText: streamedText,
              }));
            } else if (event.type === 'done') {
              // Final update with complete text
              set((state) => ({
                messages: state.messages.map((m) =>
                  m.id === tempAiId
                    ? { ...m, content: event.full_text }
                    : m,
                ),
                streamingText: '',
              }));
            } else if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      }
    } catch (error) {
      // Remove optimistic messages on failure
      set((state) => ({
        messages: state.messages.filter(
          (m) => m.id !== tempUserId && m.id !== tempAiId,
        ),
        isTyping: false,
        streamingText: '',
      }));
      throw error;
    }
  },

  createThread: async (title, description) => {
    const thread = await api.post<Thread>('/api/v1/threads', { title, description });
    set((state) => ({ threads: [thread, ...state.threads] }));
    return thread;
  },
}));
