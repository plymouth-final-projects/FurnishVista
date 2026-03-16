package com.backend.backend.modules.design.service;

import com.backend.backend.common.exception.ResourceNotFoundException;
import com.backend.backend.modules.design.dto.CreateDesignRequest;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.dto.UpdateDesignRequest;
import com.backend.backend.modules.design.entity.Design;
import com.backend.backend.modules.design.repository.DesignRepository;
import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.dto.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DesignService {

    private final DesignRepository designRepository;

    public DesignResponse create(CreateDesignRequest request) {
        Instant now = Instant.now();
        String id = "design-" + UUID.randomUUID();
        Design design = Design.builder()
                .id(id)
                .name(request.name())
                .room(toRoomResponse(request.room()))
                .furniture(request.furniture())
                .createdAt(now.toString())
                .updatedAt(now.toString())
                .thumbnail(request.thumbnail())
                .designerId(request.designerId() == null || request.designerId().isBlank() ? "user-1" : request.designerId())
                .build();
        designRepository.save(design);
        return toResponse(design);
    }

    public DesignResponse update(String id, UpdateDesignRequest request) {
        Design current = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        Design updated = Design.builder()
                .id(current.id())
                .name(request.name() == null || request.name().isBlank() ? current.name() : request.name())
                .room(request.room() == null ? current.room() : toRoomResponse(request.room()))
                .furniture(request.furniture() == null ? current.furniture() : request.furniture())
                .createdAt(current.createdAt())
                .updatedAt(Instant.now().toString())
                .thumbnail(request.thumbnail() == null ? current.thumbnail() : request.thumbnail())
                .designerId(current.designerId())
                .build();

        designRepository.save(updated);
        return toResponse(updated);
    }

    public void delete(String id) {
        if (designRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Design not found");
        }
        designRepository.deleteById(id);
    }

    public DesignResponse duplicate(String id, String newName) {
        Design original = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        Design duplicate = Design.builder()
                .id("design-" + UUID.randomUUID())
                .name(newName == null || newName.isBlank() ? original.name() + " (Copy)" : newName)
                .room(original.room())
                .furniture(original.furniture())
                .createdAt(Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .thumbnail(original.thumbnail())
                .designerId(original.designerId())
                .build();
        designRepository.save(duplicate);
        return toResponse(duplicate);
    }

    private RoomResponse toRoomResponse(RoomRequest room) {
        if (room == null) {
            return new RoomResponse("room-1", "Living Room", 5, 4, 3, "rectangular", "#f5f5f4", "wood", "#d4a574", "#ffffff");
        }
        return new RoomResponse(
                room.id() == null || room.id().isBlank() ? "room-" + UUID.randomUUID() : room.id(),
                room.name(),
                room.width(),
                room.length(),
                room.height(),
                room.shape(),
                room.wallColor(),
                room.floorType(),
                room.floorColor(),
                room.ceilingColor()
        );
    }

    public DesignResponse toResponse(Design design) {
        return new DesignResponse(
                design.id(),
                design.name(),
                design.room(),
                design.furniture(),
                design.createdAt(),
                design.updatedAt(),
                design.thumbnail(),
                design.designerId()
        );
    }
}
