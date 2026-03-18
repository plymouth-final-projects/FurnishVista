import type { Design, PlacedFurniture } from '@/types/design.types';
import type { Room } from '@/types/room.types';
import { requestJson } from './api';

type CreateDesignPayload = {
  name: string;
  room: Room;
  furniture: PlacedFurniture[];
  thumbnail?: string | null;
  designerId?: string | null;
};

type UpdateDesignPayload = Partial<Omit<CreateDesignPayload, 'designerId'>> & {
  name?: string;
};

export async function fetchDesigns(): Promise<Design[]> {
  return requestJson<Design[]>('/api/designs', { method: 'GET' });
}

export async function fetchDesignById(id: string): Promise<Design> {
  return requestJson<Design>(`/api/designs/${id}`, { method: 'GET' });
}

export async function createDesign(payload: CreateDesignPayload): Promise<Design> {
  return requestJson<Design>('/api/designs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateDesign(id: string, payload: UpdateDesignPayload): Promise<Design> {
  return requestJson<Design>(`/api/designs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteDesign(id: string): Promise<void> {
  await requestJson<void>(`/api/designs/${id}`, { method: 'DELETE' });
}

export async function duplicateDesign(id: string, newName?: string | null): Promise<Design> {
  return requestJson<Design>(`/api/designs/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify(newName ? { newName } : {}),
  });
}
