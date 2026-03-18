import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '@/services/auth.service';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: (user) => set({ user, isLoading: false }),

      logout: () => {
        void logoutUser().catch(() => undefined);
        set({ user: null, isLoading: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
