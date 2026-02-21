import { create } from 'zustand';
import type { Design, DesignFilters } from '@/types/design.types';
import { mockDesigns } from '@/lib/mock-data';

interface DesignState {
  designs: Design[];
  isLoading: boolean;
  filters: DesignFilters;

  setDesigns: (designs: Design[]) => void;
  addDesign: (design: Design) => void;
  updateDesign: (id: string, updates: Partial<Design>) => void;
  deleteDesign: (id: string) => void;
  duplicateDesign: (id: string) => Design | null;
  getDesignById: (id: string) => Design | undefined;
  setFilters: (filters: Partial<DesignFilters>) => void;
  setLoading: (loading: boolean) => void;
  loadMockDesigns: () => void;
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

  addDesign: (design) =>
    set((state) => ({ designs: [...state.designs, design] })),

  updateDesign: (id, updates) =>
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    })),

  deleteDesign: (id) =>
    set((state) => ({
      designs: state.designs.filter((d) => d.id !== id),
    })),

  duplicateDesign: (id) => {
    const original = get().designs.find((d) => d.id === id);
    if (!original) return null;
    const newDesign: Design = {
      ...original,
      id: `design-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ designs: [...state.designs, newDesign] }));
    return newDesign;
  },

  getDesignById: (id) => get().designs.find((d) => d.id === id),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setLoading: (isLoading) => set({ isLoading }),

  loadMockDesigns: () => set({ designs: [...mockDesigns] }),

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
