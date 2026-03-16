package com.backend.backend.modules.design.mapper;

import com.backend.backend.common.util.GeometryUtils;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.dto.DesignSummaryResponse;
import org.springframework.stereotype.Component;

@Component
public class DesignMapper {

    public DesignSummaryResponse toSummary(DesignResponse design) {
        return new DesignSummaryResponse(
                design.id(),
                design.name(),
                design.room().shape(),
                GeometryUtils.roomDimensionLabel(design.room().width(), design.room().length(), design.room().height()),
                design.furniture() == null ? 0 : design.furniture().size(),
                design.createdAt(),
                design.updatedAt(),
                design.thumbnail()
        );
    }
}
