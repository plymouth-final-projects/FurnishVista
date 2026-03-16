package com.backend.backend.modules.dashboard.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.dashboard.dto.DashboardSummaryResponse;
import com.backend.backend.modules.dashboard.dto.RecentDesignResponse;
import com.backend.backend.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> summary() {
        return ApiResponse.ok("Dashboard summary", dashboardService.summary());
    }

    @GetMapping("/recent-designs")
    public ApiResponse<List<RecentDesignResponse>> recentDesigns() {
        return ApiResponse.ok("Recent designs", dashboardService.recentDesigns());
    }
}
