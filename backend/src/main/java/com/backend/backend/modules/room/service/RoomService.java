package com.backend.backend.modules.room.service;

import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.dto.RoomResponse;
import com.backend.backend.modules.room.validation.RoomValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomValidator roomValidator;
    private final List<RoomResponse> rooms = new CopyOnWriteArrayList<>();

    public RoomResponse create(RoomRequest request) {
        roomValidator.validate(request.width(), request.length(), request.height());

        RoomResponse response = new RoomResponse(
                request.id() == null || request.id().isBlank() ? "room-" + UUID.randomUUID() : request.id(),
                request.name(),
                request.width(),
                request.length(),
                request.height(),
                request.shape(),
                request.wallColor(),
                request.floorType(),
                request.floorColor(),
                request.ceilingColor()
        );
        rooms.add(response);
        return response;
    }

    public List<RoomResponse> getAll() {
        return rooms;
    }
}
