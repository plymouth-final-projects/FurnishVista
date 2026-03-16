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
        return furnitureRepository.findAll().stream()
                .filter(item -> item.id().equals(id))
                .findFirst()
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Furniture not found"));
    }

    public List<FurnitureResponse> byCategory(String category) {
        String normalized = category.toLowerCase();
        return furnitureRepository.findAll().stream()
                .filter(item -> item.category().equalsIgnoreCase(normalized))
                .map(this::toResponse)
                .toList();
    }

    public List<FurnitureResponse> search(String query) {
        String normalized = query == null ? "" : query.toLowerCase();
        return furnitureRepository.findAll().stream()
                .filter(item -> item.name().toLowerCase().contains(normalized)
                        || item.category().toLowerCase().contains(normalized)
                        || (item.description() != null && item.description().toLowerCase().contains(normalized)))
                .map(this::toResponse)
                .toList();
    }

    private FurnitureResponse toResponse(FurnitureItem item) {
        return new FurnitureResponse(
                item.id(),
                item.name(),
                item.category(),
                item.modelPath(),
                item.thumbnail(),
                item.defaultWidth(),
                item.defaultLength(),
                item.defaultHeight(),
                item.color(),
                item.description()
        );
    }
}
