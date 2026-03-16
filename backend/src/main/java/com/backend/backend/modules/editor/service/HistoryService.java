package com.backend.backend.modules.editor.service;

import com.backend.backend.modules.editor.dto.HistoryEntryResponse;
import com.backend.backend.modules.editor.entity.ActionHistory;
import com.backend.backend.modules.editor.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public void append(String designId, HistoryEntryResponse historyEntryResponse) {
        historyRepository.append(designId, new ActionHistory(
                "history-" + UUID.randomUUID(),
                designId,
                historyEntryResponse.furniture(),
                historyEntryResponse.timestamp()
        ));
    }

    public List<HistoryEntryResponse> byDesignId(String designId) {
        return historyRepository.findByDesignId(designId)
                .stream()
                .map(h -> new HistoryEntryResponse(h.furniture(), h.timestamp()))
                .toList();
    }
}
