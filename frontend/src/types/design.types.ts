import type { Room } from './room.types';
import type { PlacedFurniture } from './editor.types';

export interface Design {
  id: string;
  name: string;
  room: Room;
  furniture: PlacedFurniture[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  designerId: string;
}

export interface DesignSummary {
  id: string;
  name: string;
  roomType: string;
  roomDimensions: string;
  furnitureCount: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export type DesignSortBy = 'name' | 'createdAt' | 'updatedAt';
export type DesignSortOrder = 'asc' | 'desc';

export interface DesignFilters {
  search: string;
  sortBy: DesignSortBy;
  sortOrder: DesignSortOrder;
}
