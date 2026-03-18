'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useEditorStore } from '@/lib/stores/useEditorStore';

const WALL_THICKNESS = 0.08;

export function RoomScene() {
  const room = useEditorStore((s) => s.room);
  const gridVisible = useEditorStore((s) => s.gridVisible);

  const wallColor = useMemo(() => new THREE.Color(room.wallColor), [room.wallColor]);
  const floorColor = useMemo(() => new THREE.Color(room.floorColor), [room.floorColor]);
  const ceilingColor = useMemo(() => new THREE.Color(room.ceilingColor), [room.ceilingColor]);

  const { width, length, height } = room;
  const halfW = width / 2;
  const halfL = length / 2;
  const halfH = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} side={THREE.BackSide} />
      </mesh>

      {/* Back wall (Z = -halfL) */}
      <mesh position={[0, halfH, -halfL]} receiveShadow>
        <boxGeometry args={[width, height, WALL_THICKNESS]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Front wall (Z = +halfL) */}
      <mesh position={[0, halfH, halfL]}>
        <boxGeometry args={[width, height, WALL_THICKNESS]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.7}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left wall (X = -halfW) */}
      <mesh position={[-halfW, halfH, 0]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, height, length]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Right wall (X = +halfW) */}
      <mesh position={[halfW, halfH, 0]}>
        <boxGeometry args={[WALL_THICKNESS, height, length]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.7}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

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
