export type RoomShape = 'rectangular' | 'l-shaped' | 'square';

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
