import { create } from 'zustand';
import type { PlacedFurniture, EditorView, HistoryEntry } from '@/types/editor.types';
import type { Room } from '@/types/room.types';
import { ROOM_DEFAULTS } from '@/lib/constants';
import { useFurnitureStore } from './useFurnitureStore';

const MAX_HISTORY = 50;

interface EditorState {
  /* Room */
  room: Room;
  setRoom: (room: Room) => void;
  updateRoom: (updates: Partial<Room>) => void;
  updateRoomWithAutoFit: (updates: Partial<Pick<Room, 'width' | 'length' | 'height'>>) => void;

  /* Furniture */
  furniture: PlacedFurniture[];
  addFurniture: (item: PlacedFurniture) => void;
  updateFurniture: (id: string, updates: Partial<PlacedFurniture>) => void;
  removeFurniture: (id: string) => void;
  setFurniture: (items: PlacedFurniture[]) => void;

  /* Selection */
  selectedItemId: string | null;
  selectItem: (id: string | null) => void;

  /* View */
  view: EditorView;
  setView: (view: EditorView) => void;

  /* Grid */
  gridVisible: boolean;
  toggleGrid: () => void;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;

  /* Zoom */
  zoom: number;
  setZoom: (zoom: number) => void;

  /* History (undo/redo) */
  history: HistoryEntry[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  /* Design metadata */
  designId: string | null;
  designName: string;
  setDesignId: (id: string | null) => void;
  setDesignName: (name: string) => void;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;

  /* Reset */
  resetEditor: () => void;
}

const defaultRoom: Room = {
  id: 'new-room',
  name: 'Untitled Room',
  ...ROOM_DEFAULTS,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  room: defaultRoom,
  setRoom: (room) => set({ room }),
  updateRoom: (updates) =>
    set((state) => {
      get().pushHistory();
      return { room: { ...state.room, ...updates }, isDirty: true };
    }),
  updateRoomWithAutoFit: (updates) =>
    set((state) => {
      const nextWidth = updates.width ?? state.room.width;
      const nextLength = updates.length ?? state.room.length;
      const nextHeight = updates.height ?? state.room.height;

      const widthChanged = nextWidth !== state.room.width;
      const lengthChanged = nextLength !== state.room.length;

      get().pushHistory();

      if (!widthChanged && !lengthChanged) {
        return {
          room: {
            ...state.room,
            width: nextWidth,
            length: nextLength,
            height: nextHeight,
          },
          isDirty: true,
        };
      }

      const ratioX = state.room.width > 0 ? nextWidth / state.room.width : 1;
      const ratioZ = state.room.length > 0 ? nextLength / state.room.length : 1;
      const fitRatio = Math.min(ratioX, ratioZ);
      const { getById } = useFurnitureStore.getState();

      const updatedFurniture = state.furniture.map((item) => {
        const furniture = getById(item.furnitureId);
        if (!furniture) return item;

        const adjustedScale = Math.max(0.25, Math.min(3, item.scale * fitRatio));
        const adjustedWidth = furniture.defaultWidth * adjustedScale;
        const adjustedLength = furniture.defaultLength * adjustedScale;

        const nextX = Math.max(
          0,
          Math.min(item.position.x * ratioX, Math.max(0, nextWidth - adjustedWidth))
        );
        const nextZ = Math.max(
          0,
          Math.min(item.position.z * ratioZ, Math.max(0, nextLength - adjustedLength))
        );

        return {
          ...item,
          scale: adjustedScale,
          position: {
            ...item.position,
            x: nextX,
            z: nextZ,
          },
        };
      });

      return {
        room: {
          ...state.room,
          width: nextWidth,
          length: nextLength,
          height: nextHeight,
        },
        furniture: updatedFurniture,
        isDirty: true,
      };
    }),

  furniture: [],
  addFurniture: (item) => {
    get().pushHistory();
    set((state) => ({
      furniture: [...state.furniture, item],
      isDirty: true,
    }));
  },
  updateFurniture: (id, updates) => {
    get().pushHistory();
    set((state) => ({
      furniture: state.furniture.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
      isDirty: true,
    }));
  },
  removeFurniture: (id) => {
    get().pushHistory();
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
      isDirty: true,
    }));
  },
  setFurniture: (items) => set({ furniture: items }),

  selectedItemId: null,
  selectItem: (id) => set({ selectedItemId: id }),

  view: '2d',
  setView: (view) => set({ view }),

  gridVisible: true,
  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),
  snapToGrid: true,
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  pushHistory: () =>
    set((state) => {
      const entry: HistoryEntry = {
        furniture: JSON.parse(JSON.stringify(state.furniture)),
        timestamp: Date.now(),
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex < 0) return state;
      const entry = state.history[state.historyIndex];
      if (!entry) return state;
      const newIndex = state.historyIndex - 1;
      return {
        furniture: JSON.parse(JSON.stringify(entry.furniture)),
        historyIndex: newIndex,
        canUndo: newIndex >= 0,
        canRedo: true,
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      const nextIndex = state.historyIndex + 1;
      if (nextIndex >= state.history.length) return state;
      const nextEntry = state.history[nextIndex];
      if (!nextEntry) return state;
      /* Redo restores the state AFTER the action at nextIndex.
         If there's an entry beyond nextIndex, use its furniture;
         otherwise keep current (the last pushed state already reflects
         the action). For simplicity: the entry stores the state BEFORE
         the action, so redoing means jumping to the entry after. */
      const targetIndex = nextIndex + 1;
      const targetEntry = state.history[targetIndex];
      return {
        furniture: targetEntry
          ? JSON.parse(JSON.stringify(targetEntry.furniture))
          : state.furniture,
        historyIndex: nextIndex,
        canUndo: true,
        canRedo: targetIndex < state.history.length,
        isDirty: true,
      };
    }),

  designId: null,
  designName: 'Untitled Design',
  setDesignId: (id) => set({ designId: id }),
  setDesignName: (name) => set({ designName: name, isDirty: true }),
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),

  resetEditor: () =>
    set({
      room: defaultRoom,
      furniture: [],
      selectedItemId: null,
      view: '2d',
      gridVisible: true,
      snapToGrid: true,
      zoom: 1,
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,
      designId: null,
      designName: 'Untitled Design',
      isDirty: false,
    }),
}));
