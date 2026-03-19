package com.backend.backend.modules.design.service;

import com.backend.backend.common.constants.ErrorMessages;
import com.backend.backend.common.exception.FurnitureOverlapException;
import com.backend.backend.common.exception.ResourceNotFoundException;
import com.backend.backend.common.exception.ValidationException;
import com.backend.backend.modules.design.dto.CreateDesignRequest;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.dto.PlacedFurnitureDto;
import com.backend.backend.modules.design.dto.UpdateDesignRequest;
import com.backend.backend.modules.design.entity.Design;
import com.backend.backend.modules.design.entity.PlacedFurniture;
import com.backend.backend.modules.design.repository.DesignRepository;
import com.backend.backend.modules.design.repository.PlacedFurnitureRepository;
import com.backend.backend.modules.furniture.engine.BoundaryValidator;
import com.backend.backend.modules.furniture.engine.CollisionEngine;
import com.backend.backend.modules.furniture.entity.FurnitureItem;
import com.backend.backend.modules.furniture.repository.FurnitureRepository;
import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.dto.RoomResponse;
import com.backend.backend.modules.room.entity.Room;
import com.backend.backend.modules.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DesignService {

    private static final ZoneId SRI_LANKA_ZONE = ZoneId.of("Asia/Colombo");
    private static final String DEFAULT_ROOM_NAME = "Living Room";
    private static final double DEFAULT_ROOM_WIDTH = 5;
    private static final double DEFAULT_ROOM_LENGTH = 4;
    private static final double DEFAULT_ROOM_HEIGHT = 3;
    private static final String DEFAULT_ROOM_SHAPE = "rectangular";
    private static final String DEFAULT_WALL_COLOR = "#f5f5f4";
    private static final String DEFAULT_FLOOR_TYPE = "wood";
    private static final String DEFAULT_FLOOR_COLOR = "#d4a574";
    private static final String DEFAULT_CEILING_COLOR = "#ffffff";

    private final DesignRepository designRepository;
    private final RoomRepository roomRepository;
    private final PlacedFurnitureRepository placedFurnitureRepository;
    private final FurnitureRepository furnitureRepository;
    private final CollisionEngine collisionEngine;
    private final BoundaryValidator boundaryValidator;

    public DesignResponse create(CreateDesignRequest request) {
        LocalDateTime now = LocalDateTime.now(SRI_LANKA_ZONE);
        Room room = saveRoom(request.room());

        Design design = new Design();
        design.setId("design-" + UUID.randomUUID());
        design.setName(request.name());
        design.setRoomId(room.getId().toString());
        design.setCreatedAt(now);
        design.setUpdatedAt(now);
        design.setThumbnail(request.thumbnail());
        design.setDesignerId(request.designerId() == null || request.designerId().isBlank() ? "user-1" : request.designerId());
        designRepository.save(design);

        List<PlacedFurnitureDto> furniture = request.furniture() == null ? List.of() : request.furniture();
        savePlacedFurniture(design.getId(), furniture, room);
        return toResponse(design);
    }

    @Transactional
    public DesignResponse update(String id, UpdateDesignRequest request) {
        Design current = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        Room activeRoom = findRoom(current.getRoomId()).orElseGet(this::defaultRoom);

        if (request.room() != null) {
            Room room = updateRoom(current.getRoomId(), request.room());
            current.setRoomId(room.getId().toString());
            activeRoom = room;
        }

        if (request.name() != null && !request.name().isBlank()) {
            current.setName(request.name());
        }

        if (request.thumbnail() != null) {
            current.setThumbnail(request.thumbnail());
        }

        current.setUpdatedAt(LocalDateTime.now(SRI_LANKA_ZONE));
        designRepository.save(current);

        if (request.furniture() != null) {
            placedFurnitureRepository.deleteByDesignId(current.getId());
            savePlacedFurniture(current.getId(), request.furniture(), activeRoom);
        }

        return toResponse(current);
    }

    @Transactional
    public void delete(String id) {
        if (designRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Design not found");
        }
        placedFurnitureRepository.deleteByDesignId(id);
        designRepository.deleteById(id);
    }

    public DesignResponse duplicate(String id, String newName) {
        Design original = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        Room originalRoom = findRoom(original.getRoomId())
                .orElseGet(this::defaultRoom);
        Room duplicatedRoom = copyRoom(originalRoom);

        Design duplicate = new Design();
        duplicate.setId("design-" + UUID.randomUUID());
        duplicate.setName(newName == null || newName.isBlank() ? original.getName() + " (Copy)" : newName);
        duplicate.setRoomId(duplicatedRoom.getId().toString());
        duplicate.setCreatedAt(LocalDateTime.now(SRI_LANKA_ZONE));
        duplicate.setUpdatedAt(LocalDateTime.now(SRI_LANKA_ZONE));
        duplicate.setThumbnail(original.getThumbnail());
        duplicate.setDesignerId(original.getDesignerId());
        designRepository.save(duplicate);

        List<PlacedFurniture> furniture = placedFurnitureRepository.findByDesignId(original.getId());
        savePlacedFurniture(duplicate.getId(), toDtoList(furniture), duplicatedRoom);

        return toResponse(duplicate);
    }

    public DesignResponse toResponse(Design design) {
        Room room = findRoom(design.getRoomId()).orElseGet(this::defaultRoom);
        List<PlacedFurniture> furniture = placedFurnitureRepository.findByDesignId(design.getId());

        return new DesignResponse(
                design.getId(),
                design.getName(),
                toRoomResponse(room),
                toDtoList(furniture),
                design.getCreatedAt() == null ? null : design.getCreatedAt().toString(),
                design.getUpdatedAt() == null ? null : design.getUpdatedAt().toString(),
                design.getThumbnail(),
                design.getDesignerId()
        );
    }

    private Room saveRoom(RoomRequest request) {
        Room room = request == null ? defaultRoom() : new Room();
        if (request != null) {
            room.setName(request.name());
            room.setWidth(request.width());
            room.setLength(request.length());
            room.setHeight(request.height());
            room.setShape(request.shape());
            room.setWallColor(request.wallColor());
            room.setFloorType(request.floorType());
            room.setFloorColor(request.floorColor());
            room.setCeilingColor(request.ceilingColor());
        }
        return roomRepository.save(room);
    }

    private Room updateRoom(String roomId, RoomRequest request) {
        Room room = findRoom(roomId).orElseGet(Room::new);
        String name = request.name();
        String shape = request.shape();
        String wallColor = request.wallColor();
        String floorType = request.floorType();
        String floorColor = request.floorColor();
        String ceilingColor = request.ceilingColor();

        room.setName(name != null && !name.isBlank() ? name
            : room.getName() != null && !room.getName().isBlank() ? room.getName() : DEFAULT_ROOM_NAME);
        room.setWidth(request.width() > 0 ? request.width() : room.getWidth() > 0 ? room.getWidth() : DEFAULT_ROOM_WIDTH);
        room.setLength(request.length() > 0 ? request.length() : room.getLength() > 0 ? room.getLength() : DEFAULT_ROOM_LENGTH);
        room.setHeight(request.height() > 0 ? request.height() : room.getHeight() > 0 ? room.getHeight() : DEFAULT_ROOM_HEIGHT);
        room.setShape(shape != null && !shape.isBlank() ? shape
            : room.getShape() != null && !room.getShape().isBlank() ? room.getShape() : DEFAULT_ROOM_SHAPE);
        room.setWallColor(wallColor != null && !wallColor.isBlank() ? wallColor
            : room.getWallColor() != null && !room.getWallColor().isBlank() ? room.getWallColor() : DEFAULT_WALL_COLOR);
        room.setFloorType(floorType != null && !floorType.isBlank() ? floorType
            : room.getFloorType() != null && !room.getFloorType().isBlank() ? room.getFloorType() : DEFAULT_FLOOR_TYPE);
        room.setFloorColor(floorColor != null && !floorColor.isBlank() ? floorColor
            : room.getFloorColor() != null && !room.getFloorColor().isBlank() ? room.getFloorColor() : DEFAULT_FLOOR_COLOR);
        room.setCeilingColor(ceilingColor != null && !ceilingColor.isBlank() ? ceilingColor
            : room.getCeilingColor() != null && !room.getCeilingColor().isBlank() ? room.getCeilingColor() : DEFAULT_CEILING_COLOR);
        return roomRepository.save(room);
    }

    private Optional<Room> findRoom(String roomId) {
        if (roomId == null || roomId.isBlank()) {
            return Optional.empty();
        }
        try {
            return roomRepository.findById(Long.parseLong(roomId));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    private Room defaultRoom() {
        Room room = new Room();
        room.setName("Living Room");
        room.setWidth(5);
        room.setLength(4);
        room.setHeight(3);
        room.setShape("rectangular");
        room.setWallColor("#f5f5f4");
        room.setFloorType("wood");
        room.setFloorColor("#d4a574");
        room.setCeilingColor("#ffffff");
        return roomRepository.save(room);
    }

    private Room copyRoom(Room source) {
        Room room = new Room();
        room.setName(source.getName());
        room.setWidth(source.getWidth());
        room.setLength(source.getLength());
        room.setHeight(source.getHeight());
        room.setShape(source.getShape());
        room.setWallColor(source.getWallColor());
        room.setFloorType(source.getFloorType());
        room.setFloorColor(source.getFloorColor());
        room.setCeilingColor(source.getCeilingColor());
        return roomRepository.save(room);
    }

    private RoomResponse toRoomResponse(Room room) {
        return new RoomResponse(
                room.getId() == null ? "" : room.getId().toString(),
                room.getName(),
                room.getWidth(),
                room.getLength(),
                room.getHeight(),
                room.getShape(),
                room.getWallColor(),
                room.getFloorType(),
                room.getFloorColor(),
                room.getCeilingColor()
        );
    }

    private void savePlacedFurniture(String designId, List<PlacedFurnitureDto> furniture, Room room) {
        validateFurnitureLayout(furniture, room);

        List<PlacedFurniture> entities = new ArrayList<>();
        for (PlacedFurnitureDto placed : furniture) {
            if (placed == null || placed.furnitureId() == null || placed.furnitureId().isBlank()) {
                continue;
            }
            PlacedFurnitureDto.Position position = placed.position() == null
                ? new PlacedFurnitureDto.Position(0, 0, 0)
                : placed.position();
            PlacedFurniture entity = new PlacedFurniture();
            entity.setId(placed.id() == null || placed.id().isBlank() ? "placed-" + UUID.randomUUID() : placed.id());
            entity.setDesignId(designId);
            entity.setFurnitureId(placed.furnitureId());
            entity.setPositionX(position.x());
            entity.setPositionY(position.y());
            entity.setPositionZ(position.z());
            entity.setRotation(placed.rotation());
            entity.setScale(placed.scale());
            entity.setColor(placed.color());
            entity.setShading(placed.shading());
            entities.add(entity);
        }
        placedFurnitureRepository.saveAll(entities);
    }

    private void validateFurnitureLayout(List<PlacedFurnitureDto> furniture, Room room) {
        if (furniture == null || furniture.isEmpty()) {
            return;
        }

        Set<String> furnitureIds = new HashSet<>();
        for (PlacedFurnitureDto placed : furniture) {
            if (placed != null && placed.furnitureId() != null && !placed.furnitureId().isBlank()) {
                furnitureIds.add(placed.furnitureId());
            }
        }

        Map<String, FurnitureItem> itemsById = new HashMap<>();
        for (FurnitureItem item : furnitureRepository.findAllById(furnitureIds)) {
            itemsById.put(item.getId(), item);
        }

        List<LayoutBox> boxes = new ArrayList<>();
        for (PlacedFurnitureDto placed : furniture) {
            if (placed == null || placed.furnitureId() == null || placed.furnitureId().isBlank()) {
                continue;
            }

            FurnitureItem furnitureItem = itemsById.get(placed.furnitureId());
            if (furnitureItem == null) {
                throw new ResourceNotFoundException("Furniture not found: " + placed.furnitureId());
            }

            PlacedFurnitureDto.Position position = placed.position() == null
                ? new PlacedFurnitureDto.Position(0, 0, 0)
                : placed.position();

            double scale = placed.scale() > 0 ? placed.scale() : 1;
            double width = furnitureItem.getDefaultWidth() * scale;
            double length = furnitureItem.getDefaultLength() * scale;

            double maxX = Math.max(0, room.getWidth() - width);
            double maxZ = Math.max(0, room.getLength() - length);
            if (!boundaryValidator.withinBounds(position.x(), position.z(), maxX, maxZ)) {
                throw new ValidationException("Furniture item is outside room bounds");
            }

            boxes.add(new LayoutBox(
                placed.id() == null || placed.id().isBlank() ? UUID.randomUUID().toString() : placed.id(),
                position.x(),
                position.z(),
                width,
                length
            ));
        }

        for (int i = 0; i < boxes.size(); i++) {
            LayoutBox first = boxes.get(i);
            for (int j = i + 1; j < boxes.size(); j++) {
                LayoutBox second = boxes.get(j);
                if (collisionEngine.collides(
                    first.x,
                    first.z,
                    first.width,
                    first.length,
                    second.x,
                    second.z,
                    second.width,
                    second.length
                )) {
                    throw new FurnitureOverlapException(ErrorMessages.FURNITURE_OVERLAP);
                }
            }
        }
    }

    private record LayoutBox(String id, double x, double z, double width, double length) {
    }

    private List<PlacedFurnitureDto> toDtoList(List<PlacedFurniture> furniture) {
        return furniture.stream()
                .map(placed -> new PlacedFurnitureDto(
                        placed.getId(),
                        placed.getFurnitureId(),
                        new PlacedFurnitureDto.Position(
                                placed.getPositionX(),
                                placed.getPositionY(),
                                placed.getPositionZ()
                        ),
                        placed.getRotation(),
                        placed.getScale(),
                        placed.getColor(),
                        placed.getShading()
                ))
                .toList();
    }
}
