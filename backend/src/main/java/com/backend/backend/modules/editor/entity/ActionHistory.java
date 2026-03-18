package com.backend.backend.modules.editor.entity;

import com.backend.backend.modules.design.dto.PlacedFurnitureDto;

import java.util.List;

public record ActionHistory(
        String id,
        String designId,
        List<PlacedFurnitureDto> furniture,
        long timestamp
) {
}
