package com.backend.backend.modules.room.repository;

import com.backend.backend.modules.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
