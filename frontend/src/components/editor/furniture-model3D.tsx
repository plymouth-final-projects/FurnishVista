'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { PlacedFurniture } from '@/types/editor.types';
import type { FurnitureItem } from '@/types/furniture.types';


// Preload all models
const MODEL_PATHS = [
  '/models/Couch Small.glb',
  '/models/Desk.glb',
  '/models/Night Stand.glb',
  '/models/Couch Wide.glb',
  '/models/Closet.glb',
  '/models/Lamp Round Floor.glb',
  '/models/Table.glb',
  '/models/Bed Double.glb',
];
MODEL_PATHS.forEach((p) => useGLTF.preload(p));

/** Loads and renders a GLB model, auto-scaled to the target dimensions */
function GLBModel({
  path,
  width,
  length,
  height,
}: {
  path: string;
  width: number;
  length: number;
  height: number;
}) {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const [scale, offset] = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Avoid division by zero for degenerate models
    const sx = size.x > 0 ? width / size.x : 1;
    const sy = size.y > 0 ? height / size.y : 1;
    const sz = size.z > 0 ? length / size.z : 1;
    const s: [number, number, number] = [sx, sy, sz];
    // Recentre so model sits at group origin (group position.y == h/2)
    const o: [number, number, number] = [
      -center.x * sx,
      -center.y * sy,
      -center.z * sz,
    ];
    return [s, o];
  }, [cloned, width, height, length]);

  return (
    <primitive
      object={cloned}
      scale={scale}
      position={offset}
      castShadow
      receiveShadow
    />
  );
}

interface FurnitureModel3DProps {
  placed: PlacedFurniture;
  furniture: FurnitureItem;
  isSelected: boolean;
  roomWidth: number;
  roomLength: number;
  onSelect: () => void;
  onDragStart: (id: string, nativeEvent: PointerEvent) => void;
}

export function FurnitureModel3D({
  placed,
  furniture,
  isSelected,
  roomWidth,
  roomLength,
  onSelect,
  onDragStart,
}: FurnitureModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const w = furniture.defaultWidth * placed.scale;
  const l = furniture.defaultLength * placed.scale;
  const h = furniture.defaultHeight * placed.scale;

  // Convert from 2D (top-left origin) to 3D (center origin) coordinate system
  const x = placed.position.x + w / 2 - roomWidth / 2;
  const z = placed.position.z + l / 2 - roomLength / 2;
  const y = h / 2;

  const color = new THREE.Color(placed.color);

  // Animate selection glow
  useFrame(() => {
    if (!groupRef.current) return;
    const target = isSelected ? 0.03 : 0;
    const current = groupRef.current.position.y - y;
    groupRef.current.position.y = y + THREE.MathUtils.lerp(current, target, 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      rotation={[0, THREE.MathUtils.degToRad(-placed.rotation + 180), 0]}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        onDragStart(placed.id, e.nativeEvent);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Load the real GLB model, fall back to procedural box while loading */}
      <Suspense
        fallback={
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w, h, l]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
          </mesh>
        }
      >
        <GLBModel path={furniture.modelPath} width={w} length={l} height={h} />
      </Suspense>

      {/* Selection outline */}
      {(isSelected || hovered) && (
        <mesh>
          <boxGeometry args={[w + 0.05, h + 0.05, l + 0.05]} />
          <meshBasicMaterial
            color={isSelected ? '#7c3aed' : '#a78bfa'}
            wireframe
            transparent
            opacity={isSelected ? 0.8 : 0.4}
          />
        </mesh>
      )}

      {/* Shadow on floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -h / 2 + 0.002, 0]}
      >
        <planeGeometry args={[w * 1.1, l * 1.1]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

