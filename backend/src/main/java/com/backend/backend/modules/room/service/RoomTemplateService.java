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
                template.id(),
                template.name(),
                template.description(),
                template.thumbnail(),
                new RoomTemplateResponse.RoomTemplateRoomResponse(
                        template.width(),
                        template.length(),
                        template.height(),
                        template.shape(),
                        template.wallColor(),
                        template.floorType(),
                        template.floorColor(),
                        template.ceilingColor()
                )
        );
    }
}
