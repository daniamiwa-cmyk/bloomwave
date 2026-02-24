import { create } from 'zustand';
import { api } from '../services/api';
import type { Message, SendMessageResponse, MessageHistoryResponse, Thread } from '@alora/shared';

interface ChatState {
  threads: Thread[];
  currentThreadId: string | null;
  messages: Message[];
  isTyping: boolean;
  isLoadingHistory: boolean;
  hasMore: boolean;
  gemsRemaining: number;

  loadThreads: () => Promise<void>;
  setCurrentThread: (threadId: string) => void;
  loadMessages: (threadId: string, page?: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  createThread: (title: string, description?: string) => Promise<Thread>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],
  currentThreadId: null,
  messages: [],
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

  sendMessage: async (content) => {
    const { currentThreadId } = get();
    if (!currentThreadId) return;

    // Optimistic: add user message
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
      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempId),
        isTyping: false,
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
