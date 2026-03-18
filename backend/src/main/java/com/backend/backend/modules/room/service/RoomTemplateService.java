package com.backend.backend.modules.room.service;

import com.backend.backend.modules.room.dto.RoomTemplateResponse;
import com.backend.backend.modules.room.entity.RoomTemplate;
import com.backend.backend.modules.room.repository.RoomTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTemplateService {

    private final RoomTemplateRepository roomTemplateRepository;

    public List<RoomTemplateResponse> getTemplates() {
        return roomTemplateRepository.findAll().stream().map(this::toResponse).toList();
    }

    private RoomTemplateResponse toResponse(RoomTemplate template) {
        return new RoomTemplateResponse(
            template.getId(),
            template.getName(),
            template.getDescription(),
            template.getThumbnail(),
                new RoomTemplateResponse.RoomTemplateRoomResponse(
                template.getWidth(),
                template.getLength(),
                template.getHeight(),
                template.getShape(),
                template.getWallColor(),
                template.getFloorType(),
                template.getFloorColor(),
                template.getCeilingColor()
                )
        );
    }
}
