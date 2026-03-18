package com.backend.backend.modules.dashboard.service;

import com.backend.backend.modules.dashboard.dto.DashboardSummaryResponse;
import com.backend.backend.modules.dashboard.dto.RecentDesignResponse;
import com.backend.backend.modules.design.service.DesignQueryService;
import com.backend.backend.modules.furniture.service.FurnitureService;
import com.backend.backend.modules.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DesignQueryService designQueryService;
    private final FurnitureService furnitureService;
    private final RoomRepository roomRepository;

    public DashboardSummaryResponse summary() {
        int designCount = designQueryService.all().size();
        return new DashboardSummaryResponse(
                designCount,
            (int) roomRepository.count(),
                furnitureService.getAll().size(),
                Instant.now().toString()
        );
    }

    public List<RecentDesignResponse> recentDesigns() {
        return designQueryService.all().stream()
                .limit(5)
                .map(design -> new RecentDesignResponse(design.id(), design.name(), design.updatedAt(), design.thumbnail()))
                .toList();
    }
}
