package com.backend.backend.modules.editor.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.editor.dto.EditorStateResponse;
import com.backend.backend.modules.editor.dto.HistoryEntryResponse;
import com.backend.backend.modules.editor.dto.LayoutUpdateRequest;
import com.backend.backend.modules.editor.service.EditorService;
import com.backend.backend.modules.editor.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/editor")
@RequiredArgsConstructor
public class EditorController {

    private final EditorService editorService;
    private final HistoryService historyService;

    @GetMapping("/{designId}/state")
    public ApiResponse<EditorStateResponse> state(@PathVariable String designId) {
        return ApiResponse.ok("Editor state", editorService.state(designId));
    }

    @PutMapping("/{designId}/layout")
    public ApiResponse<EditorStateResponse> updateLayout(@PathVariable String designId, @RequestBody LayoutUpdateRequest request) {
        EditorStateResponse state = editorService.update(designId, request);
        historyService.append(designId, editorService.toHistory(state));
        return ApiResponse.ok("Layout updated", state);
    }

    @GetMapping("/{designId}/history")
    public ApiResponse<List<HistoryEntryResponse>> history(@PathVariable String designId) {
        return ApiResponse.ok("Edit history", historyService.byDesignId(designId));
    }
}
