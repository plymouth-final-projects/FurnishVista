package com.backend.backend.modules.room.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.room.dto.RoomTemplateResponse;
import com.backend.backend.modules.room.service.RoomTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms/templates")
@RequiredArgsConstructor
public class RoomTemplateController {

    private final RoomTemplateService roomTemplateService;

    @GetMapping
    public ApiResponse<List<RoomTemplateResponse>> templates() {
        return ApiResponse.ok("Room templates", roomTemplateService.getTemplates());
    }
}
