package com.backend.backend.modules.furniture.entity;

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
@Table(name = "furniture_items")
public class FurnitureItem {

        @Id
        private String id;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false)
        private String category;

        @Column(name = "model_path")
        private String modelPath;

        private String thumbnail;

        @Column(name = "default_width")
        private double defaultWidth;

        @Column(name = "default_length")
        private double defaultLength;

        @Column(name = "default_height")
        private double defaultHeight;

        private String color;

        private String description;
}
