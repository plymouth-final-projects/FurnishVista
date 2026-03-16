package com.backend.backend.modules.design.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.design.dto.CreateDesignRequest;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.dto.DesignSummaryResponse;
import com.backend.backend.modules.design.dto.DuplicateDesignRequest;
import com.backend.backend.modules.design.dto.UpdateDesignRequest;
import com.backend.backend.modules.design.mapper.DesignMapper;
import com.backend.backend.modules.design.service.DesignQueryService;
import com.backend.backend.modules.design.service.DesignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class DesignController {

    private final DesignService designService;
    private final DesignQueryService designQueryService;
    private final DesignMapper designMapper;

    @GetMapping
    public ApiResponse<List<DesignResponse>> all() {
        return ApiResponse.ok("Designs", designQueryService.all());
    }

    @GetMapping("/{id}")
    public ApiResponse<DesignResponse> byId(@PathVariable String id) {
        return ApiResponse.ok("Design", designQueryService.byId(id));
    }

    @GetMapping("/summaries")
    public ApiResponse<List<DesignSummaryResponse>> summaries() {
        return ApiResponse.ok("Design summaries", designQueryService.all().stream().map(designMapper::toSummary).toList());
    }

    @PostMapping
    public ApiResponse<DesignResponse> create(@Valid @RequestBody CreateDesignRequest request) {
        return ApiResponse.ok("Design created", designService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<DesignResponse> update(@PathVariable String id, @RequestBody UpdateDesignRequest request) {
        return ApiResponse.ok("Design updated", designService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        designService.delete(id);
        return ApiResponse.ok("Design deleted");
    }

    @PostMapping("/{id}/duplicate")
    public ApiResponse<DesignResponse> duplicate(@PathVariable String id, @RequestBody(required = false) DuplicateDesignRequest request) {
        return ApiResponse.ok("Design duplicated", designService.duplicate(id, request == null ? null : request.newName()));
    }
}
