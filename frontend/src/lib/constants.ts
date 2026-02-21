export const APP_NAME = 'FurnishVista';
export const APP_DESCRIPTION = 'Premium furniture visualization for modern spaces';

export const GRID_SIZE = 0.5; // meters
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4;
export const DEFAULT_ZOOM = 1;

export const ROTATION_STEP = 45; // degrees

export const ROOM_DEFAULTS = {
  width: 5,
  length: 4,
  height: 3,
  wallColor: '#f5f5f4',
  floorColor: '#d4a574',
  ceilingColor: '#ffffff',
  floorType: 'wood' as const,
  shape: 'rectangular' as const,
} as const;

export const FLOOR_TEXTURES: Record<string, string> = {
  wood: '/textures/wood-floor.jpg',
  tile: '/textures/tile-floor.jpg',
  carpet: '/textures/carpet-floor.jpg',
  marble: '/textures/marble-floor.jpg',
};

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+Z', action: 'Undo' },
  { key: 'Ctrl+Shift+Z', action: 'Redo' },
  { key: 'Ctrl+S', action: 'Save design' },
  { key: 'Delete', action: 'Remove selected furniture' },
  { key: 'R', action: 'Rotate selected item 45°' },
  { key: 'Ctrl+D', action: 'Duplicate selected item' },
  { key: '2', action: 'Switch to 2D view' },
  { key: '3', action: 'Switch to 3D view' },
  { key: 'G', action: 'Toggle grid' },
  { key: 'Escape', action: 'Deselect all' },
  { key: '?', action: 'Show shortcuts panel' },
] as const;

export const FURNITURE_CATEGORIES = [
  { id: 'seating', label: 'Seating', icon: 'Armchair' },
  { id: 'tables', label: 'Tables', icon: 'Table' },
  { id: 'storage', label: 'Storage', icon: 'Archive' },
  { id: 'lighting', label: 'Lighting', icon: 'Lamp' },
  { id: 'decor', label: 'Decor', icon: 'Flower' },
] as const;
