import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  shortcutsDialogOpen: boolean;
  setShortcutsDialogOpen: (open: boolean) => void;

  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  confirmDialog: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  };
  openConfirmDialog: (title: string, description: string, onConfirm: () => void) => void;
  closeConfirmDialog: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  shortcutsDialogOpen: false,
  setShortcutsDialogOpen: (shortcutsDialogOpen) => set({ shortcutsDialogOpen }),

  onboardingComplete: false,
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),

  confirmDialog: {
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  },
  openConfirmDialog: (title, description, onConfirm) =>
    set({ confirmDialog: { open: true, title, description, onConfirm } }),
  closeConfirmDialog: () =>
    set((state) => ({
      confirmDialog: { ...state.confirmDialog, open: false },
    })),
}));
