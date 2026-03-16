package com.backend.backend.modules.design.service;

import com.backend.backend.common.exception.ResourceNotFoundException;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.repository.DesignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignQueryService {

    private final DesignRepository designRepository;
    private final DesignService designService;

    public List<DesignResponse> all() {
        return designRepository.findAll().stream()
                .map(designService::toResponse)
                .sorted(Comparator.comparing(DesignResponse::updatedAt).reversed())
                .toList();
    }

    public DesignResponse byId(String id) {
        return designRepository.findById(id)
                .map(designService::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found"));
    }
}
