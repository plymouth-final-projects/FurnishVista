import type { RoomShape } from '@/types/room.types';

export type Point2D = { x: number; y: number };

function squareOutline(width: number, length: number): Point2D[] {
  const side = Math.min(width, length);
  const offsetX = (width - side) / 2;
  const offsetY = (length - side) / 2;

  return [
    { x: offsetX, y: offsetY },
    { x: offsetX + side, y: offsetY },
    { x: offsetX + side, y: offsetY + side },
    { x: offsetX, y: offsetY + side },
  ];
}

function lShapedOutline(width: number, length: number): Point2D[] {
  const cutX = width * 0.6;
  const cutY = length * 0.55;

  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: cutY },
    { x: cutX, y: cutY },
    { x: cutX, y: length },
    { x: 0, y: length },
  ];
}

export function getRoomOutline(shape: RoomShape, width: number, length: number): Point2D[] {
  if (shape === 'square') {
    return squareOutline(width, length);
  }

  if (shape === 'l-shaped') {
    return lShapedOutline(width, length);
  }

  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: length },
    { x: 0, y: length },
  ];
}

export function toKonvaPoints(points: Point2D[]): number[] {
  return points.flatMap((point) => [point.x, point.y]);
}
