package com.backend.backend.modules.design.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "designs")
public class Design {

        @Id
        private String id;

        @Column(nullable = false)
        private String name;

        @Column(name = "room_id")
        private String roomId;

        @Column(name = "created_at")
        private LocalDateTime createdAt;

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        private String thumbnail;

        @Column(name = "designer_id")
        private String designerId;
}
