package com.backend.backend.modules.room.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.dto.RoomResponse;
import com.backend.backend.modules.room.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ApiResponse<List<RoomResponse>> all() {
        return ApiResponse.ok("Rooms", roomService.getAll());
    }

    @PostMapping
    public ApiResponse<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return ApiResponse.ok("Room created", roomService.create(request));
    }
}
