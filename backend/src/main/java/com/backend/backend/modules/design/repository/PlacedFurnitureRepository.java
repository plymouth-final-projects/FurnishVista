package com.backend.backend.modules.design.repository;

import com.backend.backend.modules.design.entity.PlacedFurniture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlacedFurnitureRepository extends JpaRepository<PlacedFurniture, String> {
    List<PlacedFurniture> findByDesignId(String designId);
    void deleteByDesignId(String designId);
}
