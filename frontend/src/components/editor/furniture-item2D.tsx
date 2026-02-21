'use client';

import { useRef, useState, useEffect } from 'react';
import { Group, Rect, Text, Circle, Image } from 'react-konva';
import type { PlacedFurniture } from '@/types/editor.types';
import type { FurnitureItem, FurnitureCategory } from '@/types/furniture.types';
import Konva from 'konva';



interface FurnitureItem2DProps {
  placed: PlacedFurniture;
  furniture: FurnitureItem;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onDrag: (dx: number, dy: number) => void;
  onDragEnd: () => void;
}

export function FurnitureItem2D({
  placed,
  furniture,
  isSelected,
  scale,
  onSelect,
  onDrag,
  onDragEnd,
}: FurnitureItem2DProps) {
  const groupRef = useRef<Konva.Group>(null);
  const isDragging = useRef(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
    };
    img.src = furniture.thumbnail;
  }, [furniture.thumbnail]);

  const widthPx = furniture.defaultWidth * placed.scale * scale;
  const heightPx = furniture.defaultLength * placed.scale * scale;
  const x = placed.position.x * scale;
  const y = placed.position.z * scale;

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    isDragging.current = true;
    e.target.moveToTop();
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = e.target.position();
    const dx = (pos.x - x) / scale;
    const dy = (pos.y - y) / scale;
    
    onDrag(dx, dy);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    onDragEnd();
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging.current) {
      e.cancelBubble = true;
      onSelect();
    }
  };

  // Calculate brightness based on shading
  const brightness = 1 - placed.shading * 0.3;
  const fillColor = placed.color + (isSelected ? '60' : '40');
  const strokeColor = isSelected ? '#3b82f6' : placed.color;

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      width={widthPx}
      height={heightPx}
      rotation={placed.rotation}
      draggable={true}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      {/* Main furniture rectangle */}
      <Rect
        width={widthPx}
        height={heightPx}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={4}
        shadowBlur={isSelected ? 8 : 4}
        shadowColor={strokeColor}
        shadowOpacity={isSelected ? 0.4 : 0.2}
        shadowOffset={{ x: 2, y: 2 }}
        filters={brightness !== 1 ? [Konva.Filters.Brighten] : []}
        brightness={brightness}
      />

      {/* Furniture thumbnail image */}
      {image && (
        <Image
          image={image}
          x={widthPx * 0.1}
          y={heightPx * 0.1}
          width={widthPx * 0.8}
          height={heightPx * 0.8}
          listening={false}
          opacity={0.8}
        />
      )}

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <Circle
            x={0}
            y={0}
            radius={4}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Circle
            x={widthPx}
            y={0}
            radius={4}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Circle
            x={0}
            y={heightPx}
            radius={4}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Circle
            x={widthPx}
            y={heightPx}
            radius={4}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          
          {/* Furniture name label */}
          <Rect
            x={widthPx / 2 - furniture.name.length * 3}
            y={-20}
            width={furniture.name.length * 6}
            height={16}
            fill="#3b82f6"
            cornerRadius={2}
          />
          <Text
            text={furniture.name}
            x={widthPx / 2 - furniture.name.length * 3}
            y={-18}
            width={furniture.name.length * 6}
            height={16}
            align="center"
            verticalAlign="middle"
            fontSize={10}
            fill="#ffffff"
            fontFamily="Arial, sans-serif"
          />
        </>
      )}
    </Group>
  );
}
