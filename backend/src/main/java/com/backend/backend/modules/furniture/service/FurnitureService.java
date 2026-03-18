package com.backend.backend.modules.furniture.service;

import com.backend.backend.common.exception.ResourceNotFoundException;
import com.backend.backend.modules.furniture.dto.FurnitureResponse;
import com.backend.backend.modules.furniture.entity.FurnitureItem;
import com.backend.backend.modules.furniture.repository.FurnitureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FurnitureService {

    private final FurnitureRepository furnitureRepository;

    public List<FurnitureResponse> getAll() {
        return furnitureRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FurnitureResponse getById(String id) {
        return furnitureRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Furniture not found"));
    }

    public List<FurnitureResponse> byCategory(String category) {
        String normalized = category.toLowerCase();
        return furnitureRepository.findAll().stream()
            .filter(item -> item.getCategory().equalsIgnoreCase(normalized))
                .map(this::toResponse)
                .toList();
    }

    public List<FurnitureResponse> search(String query) {
        String normalized = query == null ? "" : query.toLowerCase();
        return furnitureRepository.findAll().stream()
            .filter(item -> item.getName().toLowerCase().contains(normalized)
                || item.getCategory().toLowerCase().contains(normalized)
                || (item.getDescription() != null && item.getDescription().toLowerCase().contains(normalized)))
                .map(this::toResponse)
                .toList();
    }

    private FurnitureResponse toResponse(FurnitureItem item) {
        return new FurnitureResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getModelPath(),
                item.getThumbnail(),
                item.getDefaultWidth(),
                item.getDefaultLength(),
                item.getDefaultHeight(),
                item.getColor(),
                item.getDescription()
        );
    }
}
