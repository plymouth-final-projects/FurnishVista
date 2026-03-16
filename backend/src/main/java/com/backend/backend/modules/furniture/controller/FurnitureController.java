package com.backend.backend.modules.furniture.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.furniture.dto.FurnitureResponse;
import com.backend.backend.modules.furniture.service.FurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/furniture")
@RequiredArgsConstructor
public class FurnitureController {

    private final FurnitureService furnitureService;

    @GetMapping
    public ApiResponse<List<FurnitureResponse>> all() {
        return ApiResponse.ok("Furniture catalog", furnitureService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<FurnitureResponse> get(@PathVariable String id) {
        return ApiResponse.ok("Furniture item", furnitureService.getById(id));
    }

    @GetMapping("/category/{category}")
    public ApiResponse<List<FurnitureResponse>> byCategory(@PathVariable String category) {
        return ApiResponse.ok("Furniture by category", furnitureService.byCategory(category));
    }

    @GetMapping("/search")
    public ApiResponse<List<FurnitureResponse>> search(@RequestParam("q") String query) {
        return ApiResponse.ok("Search results", furnitureService.search(query));
    }
}
