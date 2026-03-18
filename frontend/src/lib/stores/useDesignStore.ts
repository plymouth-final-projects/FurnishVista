import { create } from 'zustand';
import type { Design, DesignFilters } from '@/types/design.types';
import {
  fetchDesigns,
  createDesign as createDesignRequest,
  updateDesign as updateDesignRequest,
  deleteDesign as deleteDesignRequest,
  duplicateDesign as duplicateDesignRequest,
} from '@/services/designs.service';

interface DesignState {
  designs: Design[];
  isLoading: boolean;
  filters: DesignFilters;

  setDesigns: (designs: Design[]) => void;
  getDesignById: (id: string) => Design | undefined;
  setFilters: (filters: Partial<DesignFilters>) => void;
  setLoading: (loading: boolean) => void;
  loadDesigns: () => Promise<void>;
  createDesign: (design: Omit<Design, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Design>;
  saveDesign: (id: string, updates: Partial<Design>) => Promise<Design>;
  removeDesign: (id: string) => Promise<void>;
  duplicateDesign: (id: string) => Promise<Design | null>;
  filteredDesigns: () => Design[];
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  isLoading: false,
  filters: {
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },

  setDesigns: (designs) => set({ designs }),

  getDesignById: (id) => get().designs.find((d) => d.id === id),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setLoading: (isLoading) => set({ isLoading }),

  loadDesigns: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const designs = await fetchDesigns();
      set({ designs, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createDesign: async (design) => {
    const created = await createDesignRequest({
      name: design.name,
      room: design.room,
      furniture: design.furniture,
      thumbnail: design.thumbnail ?? null,
      designerId: design.designerId ?? null,
    });
    set((state) => ({ designs: [...state.designs, created] }));
    return created;
  },

  saveDesign: async (id, updates) => {
    const updated = await updateDesignRequest(id, {
      name: updates.name,
      room: updates.room,
      furniture: updates.furniture,
      thumbnail: updates.thumbnail ?? null,
    });
    set((state) => ({
      designs: state.designs.map((d) => (d.id === id ? updated : d)),
    }));
    return updated;
  },

  removeDesign: async (id) => {
    await deleteDesignRequest(id);
    set((state) => ({
      designs: state.designs.filter((d) => d.id !== id),
    }));
  },

  duplicateDesign: async (id) => {
    const original = get().designs.find((d) => d.id === id);
    if (!original) return null;
    const duplicated = await duplicateDesignRequest(id);
    set((state) => ({ designs: [...state.designs, duplicated] }));
    return duplicated;
  },

  filteredDesigns: () => {
    const { designs, filters } = get();
    let result = [...designs];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.room.name.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return filters.sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  },
}));
