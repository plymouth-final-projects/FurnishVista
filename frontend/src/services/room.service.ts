import type { Room, RoomTemplate } from '@/types/room.types';
import { ROOM_DEFAULTS } from '@/lib/constants';

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Get room templates */
export async function getRoomTemplates(): Promise<RoomTemplate[]> {
  await delay(400);
  return [
    {
      id: 'template-1',
      name: 'Living Room',
      description: 'A spacious rectangular living room',
      thumbnail: '/images/living-room-template.png',
      room: {
        width: 5,
        length: 4,
        height: 3,
        shape: 'rectangular',
        wallColor: '#f5f5f4',
        floorType: 'wood',
        floorColor: '#d4a574',
        ceilingColor: '#ffffff',
      },
    },
    {
      id: 'template-2',
      name: 'Bedroom',
      description: 'A cozy bedroom with carpet floor',
      thumbnail: '/images/bedroom-template.png',
      room: {
        width: 4,
        length: 3.5,
        height: 2.8,
        shape: 'rectangular',
        wallColor: '#E8E0D5',
        floorType: 'carpet',
        floorColor: '#8B8178',
        ceilingColor: '#FFFFFF',
      },
    },
    {
      id: 'template-3',
      name: 'Dining Room',
      description: 'An elegant dining space with tile flooring',
      thumbnail: '/images/dining-room-template.png',
      room: {
        width: 4,
        length: 3.5,
        height: 3,
        shape: 'rectangular',
        wallColor: '#FAF8F5',
        floorType: 'tile',
        floorColor: '#C4B5A3',
        ceilingColor: '#FFFFFF',
      },
    },
    {
      id: 'template-4',
      name: 'L-Shaped Studio',
      description: 'An L-shaped open-plan studio',
      thumbnail: '/images/studio-template.png',
      room: {
        width: 6,
        length: 5,
        height: 3,
        shape: 'l-shaped',
        wallColor: '#F0EDE8',
        floorType: 'wood',
        floorColor: '#B8956A',
        ceilingColor: '#FFFFFF',
      },
    },
  ];
}

/** Create a new room with defaults */
export async function createRoom(overrides?: Partial<Room>): Promise<Room> {
  await delay(300);
  return {
    id: `room-${Date.now()}`,
    name: 'New Room',
    ...ROOM_DEFAULTS,
    ...overrides,
  };
}

/** Validate room dimensions */
export function validateRoomDimensions(room: Pick<Room, 'width' | 'length' | 'height'>): string[] {
  const errors: string[] = [];
  if (room.width < 1 || room.width > 20) errors.push('Width must be between 1 and 20 meters');
  if (room.length < 1 || room.length > 20) errors.push('Length must be between 1 and 20 meters');
  if (room.height < 2 || room.height > 5) errors.push('Height must be between 2 and 5 meters');
  return errors;
}
