package com.backend.backend.modules.editor.service;

import com.backend.backend.modules.editor.dto.EditorStateResponse;
import com.backend.backend.modules.editor.dto.HistoryEntryResponse;
import com.backend.backend.modules.editor.dto.LayoutUpdateRequest;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EditorService {

    private final Map<String, EditorStateResponse> stateByDesign = new ConcurrentHashMap<>();

    public EditorStateResponse state(String designId) {
        return stateByDesign.computeIfAbsent(designId, id -> new EditorStateResponse(null, "2d", true, true, 1.0, java.util.List.of()));
    }

    public EditorStateResponse update(String designId, LayoutUpdateRequest request) {
        EditorStateResponse response = new EditorStateResponse(
                request.selectedItemId(),
                request.view() == null ? "2d" : request.view(),
                request.gridVisible(),
                request.snapToGrid(),
                request.zoom() <= 0 ? 1.0 : request.zoom(),
                request.furniture() == null ? java.util.List.of() : request.furniture()
        );
        stateByDesign.put(designId, response);
        return response;
    }

    public HistoryEntryResponse toHistory(EditorStateResponse state) {
        return new HistoryEntryResponse(state.furniture(), System.currentTimeMillis());
    }
}
