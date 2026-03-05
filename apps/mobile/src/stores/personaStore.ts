import { create } from 'zustand';
import { api } from '../services/api';
import type {
  PersonaCard,
  PersonaGalleryResponse,
  UnlockPersonaResponse,
  PersonaGender,
  PersonaArchetype,
} from '@amai/shared';

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type FilterType = 'all' | 'unlocked' | PersonaGender | PersonaArchetype;

interface PersonaState {
  personas: PersonaCard[];
  unlockedCount: number;
  totalCount: number;
  isLoading: boolean;
  filter: FilterType;

  loadGallery: () => Promise<void>;
  unlockPersona: (personaId: string) => Promise<UnlockPersonaResponse>;
  setFilter: (filter: FilterType) => void;
  getFiltered: () => PersonaCard[];
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: [],
  unlockedCount: 0,
  totalCount: 0,
  isLoading: false,
  filter: 'all',

  loadGallery: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<PersonaGalleryResponse>('/api/v1/personas');
      set({
        personas: shuffle(data.personas),
        unlockedCount: data.unlocked_count,
        totalCount: data.total_count,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  unlockPersona: async (personaId: string) => {
    const result = await api.post<UnlockPersonaResponse>(
      `/api/v1/personas/${personaId}/unlock`,
    );

    // Update local state
    set((state) => ({
      personas: state.personas.map((p) =>
        p.id === personaId ? { ...p, is_unlocked: true } : p,
      ),
      unlockedCount: state.unlockedCount + 1,
    }));

    return result;
  },

  setFilter: (filter) => set({ filter }),

  getFiltered: () => {
    const { personas, filter } = get();
    const sortUnlockedFirst = (list: PersonaCard[]) =>
      [...list].sort((a, b) => Number(b.is_unlocked) - Number(a.is_unlocked));

    if (filter === 'all') return sortUnlockedFirst(personas);
    if (filter === 'unlocked') return personas.filter((p) => p.is_unlocked);

    // Gender filter
    if (['male', 'female', 'nonbinary'].includes(filter)) {
      return sortUnlockedFirst(personas.filter((p) => p.gender === filter));
    }

    // Archetype filter
    return sortUnlockedFirst(personas.filter((p) => p.archetype === filter));
  },
}));
