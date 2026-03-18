import { create } from 'zustand';
import type { FurnitureItem } from '@/types/furniture.types';
import { fetchFurniture } from '@/services/furniture.service';

interface FurnitureState {
  items: FurnitureItem[];
  isLoading: boolean;
  error: string | null;
  loadFurniture: () => Promise<void>;
  getById: (id: string) => FurnitureItem | undefined;
}

export const useFurnitureStore = create<FurnitureState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  loadFurniture: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const items = await fetchFurniture();
      set({ items, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load furniture';
      set({ error: message, isLoading: false });
    }
  },
  getById: (id) => get().items.find((item) => item.id === id),
}));
