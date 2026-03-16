package com.backend.backend.modules.design.repository;

import com.backend.backend.modules.design.entity.Design;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class DesignRepository {

    private final ConcurrentHashMap<String, Design> designs = new ConcurrentHashMap<>();

    public List<Design> findAll() {
        return designs.values().stream().toList();
    }

    public Optional<Design> findById(String id) {
        return Optional.ofNullable(designs.get(id));
    }

    public Design save(Design design) {
        designs.put(design.id(), design);
        return design;
    }

    public void deleteById(String id) {
        designs.remove(id);
    }
}
