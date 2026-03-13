export type FurnitureCategory = 'seating' | 'tables' | 'storage' | 'lighting' | 'decor';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  modelPath: string;
  thumbnail: string;
  defaultWidth: number;
  defaultLength: number;
  defaultHeight: number;
  color: string;
  description?: string;
}

export interface FurnitureCatalog {
  categories: FurnitureCategory[];
  items: FurnitureItem[];
}
