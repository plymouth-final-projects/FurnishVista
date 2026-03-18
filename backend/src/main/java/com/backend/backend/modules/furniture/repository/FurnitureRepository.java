package com.backend.backend.modules.furniture.repository;

import com.backend.backend.modules.furniture.entity.FurnitureItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FurnitureRepository extends JpaRepository<FurnitureItem, String> {
}
