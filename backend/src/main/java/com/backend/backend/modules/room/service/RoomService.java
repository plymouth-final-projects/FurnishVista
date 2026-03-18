package com.backend.backend.modules.room.service;

import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.dto.RoomResponse;
import com.backend.backend.modules.room.entity.Room;
import com.backend.backend.modules.room.repository.RoomRepository;
import com.backend.backend.modules.room.validation.RoomValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomValidator roomValidator;
    private final RoomRepository roomRepository;

    public RoomResponse create(RoomRequest request) {
        roomValidator.validate(request.width(), request.length(), request.height());
        Room room = new Room();
        room.setName(request.name());
        room.setWidth(request.width());
        room.setLength(request.length());
        room.setHeight(request.height());
        room.setShape(request.shape());
        room.setWallColor(request.wallColor());
        room.setFloorType(request.floorType());
        room.setFloorColor(request.floorColor());
        room.setCeilingColor(request.ceilingColor());
        Room saved = roomRepository.save(room);

        return new RoomResponse(
            saved.getId().toString(),
            saved.getName(),
            saved.getWidth(),
            saved.getLength(),
            saved.getHeight(),
            saved.getShape(),
            saved.getWallColor(),
            saved.getFloorType(),
            saved.getFloorColor(),
            saved.getCeilingColor()
        );
    }

    public List<RoomResponse> getAll() {
        return roomRepository.findAll().stream()
            .map(room -> new RoomResponse(
                room.getId().toString(),
                room.getName(),
                room.getWidth(),
                room.getLength(),
                room.getHeight(),
                room.getShape(),
                room.getWallColor(),
                room.getFloorType(),
                room.getFloorColor(),
                room.getCeilingColor()
            ))
            .toList();
    }
}
