import type { PlacedFurniture } from './design.types';

export type EditorView = '2d' | '3d';

export interface HistoryEntry {
  furniture: PlacedFurniture[];
  timestamp: number;
}

export { type PlacedFurniture } from './design.types';
