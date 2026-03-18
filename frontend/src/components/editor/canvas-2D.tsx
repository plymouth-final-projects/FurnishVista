'use client';

import { useCallback, useRef } from 'react';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import { toast } from 'sonner';
import { FurnitureItem2D } from './furniture-item2D';
import { useEditorStore } from '@/lib/stores/useEditorStore';
import { useFurnitureStore } from '@/lib/stores/useFurnitureStore';
import { GRID_SIZE } from '@/lib/constants';
import Konva from 'konva';

export function Canvas2D() {
  const {
    room,
    furniture,
    selectedItemId,
    selectItem,
    zoom,
    gridVisible,
  } = useEditorStore();
  const { getById } = useFurnitureStore();

  const stageRef = useRef<Konva.Stage>(null);
  const pxPerMeter = 80 * zoom;
  const canvasWidth = room.width * pxPerMeter;
  const canvasHeight = room.length * pxPerMeter;
  const containerWidth = Math.max(800, canvasWidth + 200);
  const containerHeight = Math.max(600, canvasHeight + 200);

  const getFurnitureData = useCallback((furnitureId: string) => {
    return getById(furnitureId);
  }, [getById]);

  const handleDrag = useCallback(
    (id: string, dx: number, dy: number) => {
      // Read fresh state to avoid stale closure during drag
      const { furniture: currentFurniture, snapToGrid: snap, room: currentRoom } = useEditorStore.getState();
      const item = currentFurniture.find((f) => f.id === id);
      if (!item) return;

      let newX = item.position.x + dx;
      let newZ = item.position.z + dy;

      if (snap) {
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newZ = Math.round(newZ / GRID_SIZE) * GRID_SIZE;
      }

      // Get furniture data to check bounds
      const furnitureData = getFurnitureData(item.furnitureId);
      if (!furnitureData) return;

      // Clamp within room bounds
      newX = Math.max(0, Math.min(newX, currentRoom.width - furnitureData.defaultWidth));
      newZ = Math.max(0, Math.min(newZ, currentRoom.length - furnitureData.defaultLength));

      // Skip pushHistory during drag for performance — it's pushed on dragEnd
      useEditorStore.setState((state) => ({
        furniture: state.furniture.map((f) =>
          f.id === id
            ? { ...f, position: { ...f.position, x: newX, z: newZ } }
            : f
        ),
        isDirty: true,
      }));
    },
    [getFurnitureData]
  );

  const handleDragEnd = useCallback(() => {
    // Push history after drag completes
    useEditorStore.getState().pushHistory();
  }, []);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if clicked on empty area (stage background)
    if (e.target === stageRef.current) {
      selectItem(null);
    }
  }, [selectItem]);

  const handleDrop = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.evt?.preventDefault();
    if (!e.evt?.dataTransfer) return;
    
    const furnitureId = e.evt.dataTransfer.getData('furnitureId');
    const item = getById(furnitureId);
    if (!item) return;

    const { room: r, addFurniture, selectItem: select } = useEditorStore.getState();
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Convert screen coordinates to world coordinates (accounting for the 100px offset)
    const worldX = (pointerPosition.x - 100) / pxPerMeter;
    const worldZ = (pointerPosition.y - 100) / pxPerMeter;

    // Center the item on the cursor and clamp to room bounds
    const x = Math.max(0, Math.min(
      worldX - item.defaultWidth / 2,
      r.width - item.defaultWidth
    ));
    const z = Math.max(0, Math.min(
      worldZ - item.defaultLength / 2,
      r.length - item.defaultLength
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
    select(newPlaced.id);
    toast.success('Added', { description: `${item.name} placed in room` });
  }, [pxPerMeter]);

  const renderGrid = useCallback(() => {
    if (!gridVisible) return null;

    const lines = [];
    const gridSpacing = GRID_SIZE * pxPerMeter;

    // Vertical lines
    for (let i = 0; i <= canvasWidth / gridSpacing; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSpacing, 0, i * gridSpacing, canvasHeight]}
          stroke="#000000"
          strokeWidth={0.5}
          opacity={0.1}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= canvasHeight / gridSpacing; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * gridSpacing, canvasWidth, i * gridSpacing]}
          stroke="#000000"
          strokeWidth={0.5}
          opacity={0.1}
        />
      );
    }

    return lines;
  }, [gridVisible, canvasWidth, canvasHeight, pxPerMeter]);

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-auto bg-muted/30 p-8">
      <div className="relative">
        {/* Dimension labels */}
        <div className="absolute -top-6 left-25 flex justify-center" style={{ width: canvasWidth }}>
          <span className="rounded bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
            {room.width}m
          </span>
        </div>
        <div className="absolute -left-10 top-25 flex items-center" style={{ height: canvasHeight }}>
          <span className="origin-center -rotate-90 rounded bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
            {room.length}m
          </span>
        </div>

        <Stage
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          onClick={handleStageClick}
          onDrop={handleDrop}
          onDragOver={(e: any) => e.evt?.preventDefault()}
          className="rounded-lg shadow-lg"
        >
          <Layer>
            {/* Room floor */}
            <Rect
              x={100}
              y={100}
              width={canvasWidth}
              height={canvasHeight}
              fill={room.floorColor}
              cornerRadius={8}
            />

            {/* Grid */}
            <Group x={100} y={100}>
              {renderGrid()}
            </Group>

            {/* Room walls */}
            <Rect
              x={100}
              y={100}
              width={canvasWidth}
              height={canvasHeight}
              stroke={room.wallColor}
              strokeWidth={6}
              cornerRadius={8}
              fill="transparent"
            />

            {/* Furniture items */}
            <Group x={100} y={100}>
              {furniture.map((placed) => {
                const furnitureData = getFurnitureData(placed.furnitureId);
                if (!furnitureData) return null;

                return (
                  <FurnitureItem2D
                    key={placed.id}
                    placed={placed}
                    furniture={furnitureData}
                    isSelected={selectedItemId === placed.id}
                    scale={pxPerMeter}
                    onSelect={() => selectItem(placed.id)}
                    onDrag={(dx, dy) => handleDrag(placed.id, dx, dy)}
                    onDragEnd={handleDragEnd}
                  />
                );
              })}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
