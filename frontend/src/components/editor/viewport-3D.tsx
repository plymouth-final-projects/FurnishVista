'use client';

import { Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';
import { RoomScene } from './room-scene';
import { FurnitureModel3D } from './furniture-model3D';
import { useEditorStore } from '@/lib/stores/useEditorStore';
import { useFurnitureStore } from '@/lib/stores/useFurnitureStore';
import { LoadingSpinner } from '@/shared/LoadingSpinner';
import { GRID_SIZE } from '@/lib/constants';

// Module-level camera ref so the drop handler (outside the Canvas) can raycast
const sceneCamera: { current: THREE.Camera | null } = { current: null };

/** Captures the R3F camera into the module-level ref each frame */
function CameraCapture() {
  const { camera } = useThree();
  useEffect(() => {
    sceneCamera.current = camera;
    return () => { sceneCamera.current = null; };
  }, [camera]);
  return null;
}

function SceneContent() {
  const { camera, gl } = useThree();
  const room = useEditorStore((s) => s.room);
  const furniture = useEditorStore((s) => s.furniture);
  const selectedItemId = useEditorStore((s) => s.selectedItemId);
  const selectItem = useEditorStore((s) => s.selectItem);
  const getById = useFurnitureStore((s) => s.getById);

  // Drag state refs (not React state to avoid re-renders during drag)
  const orbitRef = useRef<any>(null);
  const dragState = useRef({
    active: false,
    itemId: null as string | null,
    startPoint: new THREE.Vector3(),
    startPos: { x: 0, z: 0 },
  });
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());

  /** Raycast from screen coords to the floor plane (y=0) */
  const getFloorPoint = useCallback(
    (event: PointerEvent): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(mouse, camera);
      const target = new THREE.Vector3();
      const hit = raycaster.current.ray.intersectPlane(floorPlane.current, target);
      return hit ? target : null;
    },
    [camera, gl]
  );

  /** Start dragging a furniture item in 3D */
  const handleDragStart = useCallback(
    (id: string, nativeEvent: PointerEvent) => {
      const point = getFloorPoint(nativeEvent);
      if (!point) return;

      const item = useEditorStore.getState().furniture.find((f) => f.id === id);
      if (!item) return;

      dragState.current = {
        active: true,
        itemId: id,
        startPoint: point.clone(),
        startPos: { x: item.position.x, z: item.position.z },
      };

      // Disable orbit controls while dragging
      if (orbitRef.current) orbitRef.current.enabled = false;
      document.body.style.cursor = 'grabbing';

      const onPointerMove = (e: PointerEvent) => {
        if (!dragState.current.active) return;
        const currentPoint = getFloorPoint(e);
        if (!currentPoint) return;

        const deltaX = currentPoint.x - dragState.current.startPoint.x;
        const deltaZ = currentPoint.z - dragState.current.startPoint.z;

        let newX = dragState.current.startPos.x + deltaX;
        let newZ = dragState.current.startPos.z + deltaZ;

        const { snapToGrid, room } = useEditorStore.getState();
        if (snapToGrid) {
          newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          newZ = Math.round(newZ / GRID_SIZE) * GRID_SIZE;
        }

        // Get furniture data to check bounds properly
        const furnitureData = getById(item.furnitureId);
        if (!furnitureData) return;
        
        // Clamp within room bounds accounting for furniture dimensions
        newX = Math.max(0, Math.min(newX, room.width - furnitureData.defaultWidth));
        newZ = Math.max(0, Math.min(newZ, room.length - furnitureData.defaultLength));

        useEditorStore.setState((state) => ({
          furniture: state.furniture.map((f) =>
            f.id === dragState.current.itemId
              ? { ...f, position: { ...f.position, x: newX, z: newZ } }
              : f
          ),
          isDirty: true,
        }));
      };

      const onPointerUp = () => {
        dragState.current.active = false;
        dragState.current.itemId = null;
        if (orbitRef.current) orbitRef.current.enabled = true;
        document.body.style.cursor = 'auto';
        useEditorStore.getState().pushHistory();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [getFloorPoint]
  );

  const handleBackgroundClick = useCallback(() => {
    selectItem(null);
  }, [selectItem]);

  return (
    <>
      {/* Capture camera reference for use outside the Canvas */}
      <CameraCapture />

      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[room.width * 0.8, room.height * 1.2, room.length * 1.3]}
        fov={50}
        near={0.1}
        far={100}
      />

      {/* Orbit controls */}
      <OrbitControls
        ref={orbitRef}
        target={[0, room.height * 0.3, 0]}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={1}
        maxDistance={Math.max(room.width, room.length) * 3}
        enableDamping
        dampingFactor={0.08}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#F5F0EB" />
      <directionalLight
        position={[room.width, room.height * 2, room.length]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        position={[-room.width * 0.5, room.height, -room.length * 0.5]}
        intensity={0.3}
        color="#E8E0F0"
      />

      {/* Environment lighting for realistic reflections */}
      <Environment preset="apartment" background={false} />

      {/* Click background to deselect */}
      <mesh
        visible={false}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* Room */}
      <RoomScene />

      {/* Contact shadows on the floor */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.25}
        scale={Math.max(room.width, room.length) * 1.5}
        blur={2}
        far={4}
        resolution={256}
        color="#000000"
      />

      {/* Furniture */}
      {furniture.map((placed) => {
        const furnitureData = getById(placed.furnitureId);
        if (!furnitureData) return null;

        return (
          <FurnitureModel3D
            key={placed.id}
            placed={placed}
            furniture={furnitureData}
            isSelected={selectedItemId === placed.id}
            roomWidth={room.width}
            roomLength={room.length}
            onSelect={() => selectItem(placed.id)}
            onDragStart={handleDragStart}
          />
        );
      })}
    </>
  );
}

export function Viewport3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useEditorStore((s) => s.view);
  const isVisible = view === '3d';
  const getById = useFurnitureStore((s) => s.getById);

  // Handle WebGL context loss/restore
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      toast.error('3D view temporarily unavailable', { 
        description: 'Refreshing the page may help if this persists' 
      });
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      toast.success('3D view restored');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const furnitureId = e.dataTransfer.getData('furnitureId');
    const item = getById(furnitureId);
    if (!item || !sceneCamera.current) return;

    // Raycast from drop screen position to the floor plane (y = 0)
    const rect = e.currentTarget.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, sceneCamera.current);
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(floorPlane, target)) return;

    const { room, addFurniture, selectItem } = useEditorStore.getState();
    // Convert 3D world coords (centered) back to 2D room coords (top-left origin)
    // Ensure consistency with 2D canvas positioning
    const x = Math.max(0, Math.min(
      target.x + room.width / 2 - item.defaultWidth / 2,
      room.width - item.defaultWidth
    ));
    const z = Math.max(0, Math.min(
      target.z + room.length / 2 - item.defaultLength / 2,
      room.length - item.defaultLength
    ));

    const newPlaced = {
      id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      furnitureId: item.id,
      position: { x, y: 0, z },
      rotation: 0,
      scale: 1,
      color: item.color,
      shading: 0.5,
    };
    addFurniture(newPlaced);
    selectItem(newPlaced.id);
    toast.success('Added', { description: `${item.name} placed in room` });
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-linear-to-b from-muted/20 to-muted/40"
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      onDrop={handleDrop}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner label="Loading 3D scene..." size={32} />
          </div>
        }
      >
        <Canvas
          ref={canvasRef}
          shadows
          frameloop={isVisible ? 'always' : 'never'}
          gl={{
            antialias: true,
            toneMapping: 3, // ACESFilmicToneMapping
            toneMappingExposure: 1.1,
            preserveDrawingBuffer: false,
            powerPreference: 'default', // Changed from high-performance to reduce GPU stress
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false, // Performance optimization
          }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            // Configure renderer for better stability
            gl.debug.checkShaderErrors = false;
            gl.setClearColor('#f8f9fa', 1);
          }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>

      {/* 3D view controls hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
          Drag to orbit &middot; Scroll to zoom &middot; Right-click to pan
        </div>
      </div>
    </div>
  );
}
