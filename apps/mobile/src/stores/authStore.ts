import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { api } from '../services/api';
import { configurePurchases } from '../services/purchases';
import type { UserProfile } from '@amai/shared';

interface AuthState {
  userId: string | null;
  email: string | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  email: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      set({
        userId: data.session.user.id,
        email: data.session.user.email || null,
        isAuthenticated: true,
        isLoading: false,
      });
      get().loadProfile();
      configurePurchases(data.session.user.id);
    } else {
      set({ isLoading: false });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          userId: session.user.id,
          email: session.user.email || null,
          isAuthenticated: true,
        });
        get().loadProfile();
        configurePurchases(session.user.id);
      } else {
        set({ userId: null, email: null, profile: null, isAuthenticated: false });
      }
    });
    // Store subscription for potential cleanup
    (globalThis as any).__authSubscription = subscription;
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ userId: null, email: null, profile: null, isAuthenticated: false });
  },

  loadProfile: async () => {
    try {
      const profile = await api.get<UserProfile>('/api/v1/profile');
      set({ profile });
    } catch {
      // Profile may not exist yet (pre-onboarding)
    }
  },

  setProfile: (profile) => set({ profile }),
}));
