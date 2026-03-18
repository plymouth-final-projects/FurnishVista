package com.backend.backend.modules.design.repository;

import com.backend.backend.modules.design.entity.Design;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignRepository extends JpaRepository<Design, String> {
}
