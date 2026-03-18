package com.backend.backend.modules.editor.dto;

import com.backend.backend.modules.design.dto.PlacedFurnitureDto;

import java.util.List;

public record LayoutUpdateRequest(
        List<PlacedFurnitureDto> furniture,
        String view,
        boolean gridVisible,
        boolean snapToGrid,
        double zoom,
        String selectedItemId
) {
}
