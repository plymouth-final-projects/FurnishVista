package com.backend.backend.modules.room.repository;

import com.backend.backend.modules.room.entity.RoomTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoomTemplateRepository {

    public List<RoomTemplate> findAll() {
        return List.of(
                RoomTemplate.builder().id("template-1").name("Living Room").description("A spacious rectangular living room")
                        .thumbnail("/images/living-room-template.png").width(5).length(4).height(3).shape("rectangular")
                        .wallColor("#f5f5f4").floorType("wood").floorColor("#d4a574").ceilingColor("#ffffff").build(),
                RoomTemplate.builder().id("template-2").name("Bedroom").description("A cozy bedroom with carpet floor")
                        .thumbnail("/images/bedroom-template.png").width(4).length(3.5).height(2.8).shape("rectangular")
                        .wallColor("#E8E0D5").floorType("carpet").floorColor("#8B8178").ceilingColor("#FFFFFF").build(),
                RoomTemplate.builder().id("template-3").name("Dining Room").description("An elegant dining space with tile flooring")
                        .thumbnail("/images/dining-room-template.png").width(4).length(3.5).height(3).shape("rectangular")
                        .wallColor("#FAF8F5").floorType("tile").floorColor("#C4B5A3").ceilingColor("#FFFFFF").build(),
                RoomTemplate.builder().id("template-4").name("L-Shaped Studio").description("An L-shaped open-plan studio")
                        .thumbnail("/images/studio-template.png").width(6).length(5).height(3).shape("l-shaped")
                        .wallColor("#F0EDE8").floorType("wood").floorColor("#B8956A").ceilingColor("#FFFFFF").build()
        );
    }
}
