import type { Room } from './room.types';

export interface FurniturePosition {
  x: number;
  y: number;
  z: number;
}

export interface PlacedFurniture {
  id: string;
  furnitureId: string;
  position: FurniturePosition;
  rotation: number;
  scale: number;
  color: string;
  shading: number;
}

export interface Design {
  id: string;
  name: string;
  room: Room;
  furniture: PlacedFurniture[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string | null;
  designerId?: string | null;
}

export type DesignSortBy = 'updatedAt' | 'createdAt' | 'name';

export interface DesignFilters {
  search: string;
  sortBy: DesignSortBy;
  sortOrder: 'asc' | 'desc';
}
