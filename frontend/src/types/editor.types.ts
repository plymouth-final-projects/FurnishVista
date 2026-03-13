export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface PlacedFurniture {
  id: string;
  furnitureId: string;
  position: Position;
  rotation: number;
  scale: number;
  color: string;
  shading: number;
}

export type EditorView = '2d' | '3d';

export interface EditorState {
  selectedItemId: string | null;
  view: EditorView;
  gridVisible: boolean;
  snapToGrid: boolean;
  zoom: number;
}

export interface HistoryEntry {
  furniture: PlacedFurniture[];
  timestamp: number;
}
