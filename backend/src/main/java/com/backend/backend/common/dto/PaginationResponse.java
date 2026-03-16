package com.backend.backend.common.dto;

import java.util.List;

public record PaginationResponse<T>(
        List<T> items,
        long total,
        int page,
        int size
) {
}
