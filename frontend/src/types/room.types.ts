export type RoomShape = 'rectangular' | 'l-shaped' | 'custom';
export type FloorType = 'wood' | 'tile' | 'carpet' | 'marble';

export interface Room {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
  shape: RoomShape;
  wallColor: string;
  floorType: FloorType;
  floorColor: string;
  ceilingColor: string;
}

export interface RoomTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  room: Omit<Room, 'id' | 'name'>;
}
