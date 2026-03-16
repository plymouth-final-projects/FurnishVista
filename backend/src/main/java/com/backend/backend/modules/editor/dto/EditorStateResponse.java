package com.backend.backend.modules.editor.dto;

import com.backend.backend.modules.design.entity.PlacedFurniture;

import java.util.List;

public record EditorStateResponse(
        String selectedItemId,
        String view,
        boolean gridVisible,
        boolean snapToGrid,
        double zoom,
        List<PlacedFurniture> furniture
) {
}
