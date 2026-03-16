package com.backend.backend.common.dto;

import com.backend.backend.common.util.DateTimeUtils;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        String timestamp
) {
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, DateTimeUtils.nowIso());
    }

    public static ApiResponse<Void> ok(String message) {
        return new ApiResponse<>(true, message, null, DateTimeUtils.nowIso());
    }

    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null, DateTimeUtils.nowIso());
    }
}
