package com.backend.backend.modules.room.entity;

import com.backend.backend.common.model.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    private double width;
    private double length;
    private double height;

    @Column(nullable = false)
    private String shape;

    @Column(nullable = false)
    private String wallColor;

    @Column(nullable = false)
    private String floorType;

    @Column(nullable = false)
    private String floorColor;

    @Column(nullable = false)
    private String ceilingColor;
}
