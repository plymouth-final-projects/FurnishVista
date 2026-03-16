package com.backend.backend.modules.editor.dto;

import com.backend.backend.modules.design.entity.PlacedFurniture;

import java.util.List;

public record HistoryEntryResponse(
        List<PlacedFurniture> furniture,
        long timestamp
) {
}
