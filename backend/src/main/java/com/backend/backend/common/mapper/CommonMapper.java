package com.backend.backend.common.mapper;

import java.util.List;
import java.util.function.Function;

public final class CommonMapper {

    private CommonMapper() {
    }

    public static <T, R> List<R> mapList(List<T> source, Function<T, R> mapper) {
        return source.stream().map(mapper).toList();
    }
}
