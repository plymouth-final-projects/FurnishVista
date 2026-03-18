package com.backend.backend.modules.room.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "room_templates")
public class RoomTemplate {

        @Id
        private String id;

        @Column(nullable = false)
        private String name;

        private String description;

        private String thumbnail;

        private double width;

        private double length;

        private double height;

        private String shape;

        @Column(name = "wall_color")
        private String wallColor;

        @Column(name = "floor_type")
        private String floorType;

        @Column(name = "floor_color")
        private String floorColor;

        @Column(name = "ceiling_color")
        private String ceilingColor;
}
