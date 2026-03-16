package com.backend.backend.modules.editor.entity;

import com.backend.backend.modules.design.entity.PlacedFurniture;

import java.util.List;

public record ActionHistory(
        String id,
        String designId,
        List<PlacedFurniture> furniture,
        long timestamp
) {
}
