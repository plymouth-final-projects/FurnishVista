package com.backend.backend.modules.room.repository;

import com.backend.backend.modules.room.entity.RoomTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTemplateRepository extends JpaRepository<RoomTemplate, String> {
}
