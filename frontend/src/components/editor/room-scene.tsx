'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useEditorStore } from '@/lib/stores/useEditorStore';
import { getRoomOutline } from '@/lib/room-shape';

const WALL_THICKNESS = 0.08;

export function RoomScene() {
  const room = useEditorStore((s) => s.room);
  const gridVisible = useEditorStore((s) => s.gridVisible);

  const wallColor = useMemo(() => new THREE.Color(room.wallColor), [room.wallColor]);
  const floorColor = useMemo(() => new THREE.Color(room.floorColor), [room.floorColor]);
  const ceilingColor = useMemo(() => new THREE.Color(room.ceilingColor), [room.ceilingColor]);

  const { width, length, height } = room;
  const halfH = height / 2;

  const outline = useMemo(() => {
    const points = getRoomOutline(room.shape, width, length);
    return points.map((point) => ({
      x: point.x - width / 2,
      z: point.y - length / 2,
    }));
  }, [room.shape, width, length]);

  const floorShape = useMemo(() => {
    const shape = new THREE.Shape();
    const first = outline[0];
    if (!first) return shape;
    shape.moveTo(first.x, first.z);
    outline.slice(1).forEach((point) => shape.lineTo(point.x, point.z));
    shape.closePath();
    return shape;
  }, [outline]);

  const wallSegments = useMemo(() => {
    if (outline.length < 2) return [];

    return outline.map((point, index) => {
      const next = outline[(index + 1) % outline.length];
      const midX = (point.x + next.x) / 2;
      const midZ = (point.z + next.z) / 2;
      const dx = next.x - point.x;
      const dz = next.z - point.z;
      const segmentLength = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      return {
        key: `${index}-${midX}-${midZ}`,
        midX,
        midZ,
        segmentLength,
        angle,
      };
    });
  }, [outline]);

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} side={THREE.BackSide} />
      </mesh>

      {/* Polygon walls */}
      {wallSegments.map((segment) => (
        <mesh
          key={segment.key}
          position={[segment.midX, halfH, segment.midZ]}
          rotation={[0, -segment.angle, 0]}
          receiveShadow
        >
          <boxGeometry args={[segment.segmentLength, height, WALL_THICKNESS]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>
      ))}

      {/* Floor grid helper */}
      {gridVisible && (
        <gridHelper
          args={[Math.max(width, length), Math.max(width, length) * 2, '#666666', '#cccccc']}
          position={[0, 0.001, 0]}
        />
      )}
    </group>
  );
}
