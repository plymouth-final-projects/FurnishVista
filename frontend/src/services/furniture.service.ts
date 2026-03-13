import type { FurnitureItem, FurnitureCategory } from '@/types/furniture.types';
import { mockFurniture } from '@/lib/mock-data';

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all furniture items */
export async function getFurnitureItems(): Promise<FurnitureItem[]> {
  await delay();
  return [...mockFurniture];
}

/** Fetch furniture items by category */
export async function getFurnitureByCategory(
  category: FurnitureCategory
): Promise<FurnitureItem[]> {
  await delay(300);
  return mockFurniture.filter((item) => item.category === category);
}

/** Fetch a single furniture item by ID */
export async function getFurnitureById(id: string): Promise<FurnitureItem | null> {
  await delay(200);
  return mockFurniture.find((item) => item.id === id) ?? null;
}

/** Search furniture by name */
export async function searchFurniture(query: string): Promise<FurnitureItem[]> {
  await delay(300);
  const q = query.toLowerCase();
  return mockFurniture.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
  );
}
