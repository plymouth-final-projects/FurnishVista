import type { FurnitureItem } from '@/types/furniture.types';
import { requestJson } from './api';

export async function fetchFurniture(): Promise<FurnitureItem[]> {
  return requestJson<FurnitureItem[]>('/api/furniture', { method: 'GET' });
}

export async function fetchFurnitureById(id: string): Promise<FurnitureItem> {
  return requestJson<FurnitureItem>(`/api/furniture/${id}`, { method: 'GET' });
}
