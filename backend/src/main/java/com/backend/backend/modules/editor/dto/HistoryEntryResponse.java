package com.backend.backend.modules.editor.dto;

import com.backend.backend.modules.design.dto.PlacedFurnitureDto;

import java.util.List;

public record HistoryEntryResponse(
        List<PlacedFurnitureDto> furniture,
        long timestamp
) {
}
