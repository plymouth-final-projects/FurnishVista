package com.backend.backend.modules.design.entity;

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
@Table(name = "placed_furniture")
public class PlacedFurniture {

    @Id
    private String id;

    @Column(name = "design_id", nullable = false)
    private String designId;

    @Column(name = "furniture_id", nullable = false)
    private String furnitureId;

    @Column(name = "position_x")
    private double positionX;

    @Column(name = "position_y")
    private double positionY;

    @Column(name = "position_z")
    private double positionZ;

    private double rotation;

    private double scale;

    private String color;

    private double shading;
}
