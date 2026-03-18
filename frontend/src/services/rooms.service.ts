import type { Room } from '@/types/room.types';
import { requestJson } from './api';

export type RoomTemplate = {
  id: string;
  name: string;
  description?: string | null;
  thumbnail?: string | null;
  room: Omit<Room, 'id' | 'name'>;
};

export async function fetchRoomTemplates(): Promise<RoomTemplate[]> {
  return requestJson<RoomTemplate[]>('/api/rooms/templates', { method: 'GET' });
}

export async function createRoom(payload: Room): Promise<Room> {
  return requestJson<Room>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
