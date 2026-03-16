package com.backend.backend.modules.editor.repository;

import com.backend.backend.modules.editor.entity.ActionHistory;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class HistoryRepository {

    private final Map<String, List<ActionHistory>> storage = new ConcurrentHashMap<>();

    public List<ActionHistory> findByDesignId(String designId) {
        return storage.getOrDefault(designId, List.of());
    }

    public void append(String designId, ActionHistory history) {
        storage.compute(designId, (key, existing) -> {
            List<ActionHistory> next = existing == null ? new ArrayList<>() : new ArrayList<>(existing);
            next.add(history);
            return next;
        });
    }
}
