package com.backend.backend.modules.design.service;

import com.backend.backend.common.exception.FurnitureOverlapException;
import com.backend.backend.modules.design.dto.CreateDesignRequest;
import com.backend.backend.modules.design.dto.DesignResponse;
import com.backend.backend.modules.design.dto.PlacedFurnitureDto;
import com.backend.backend.modules.design.entity.Design;
import com.backend.backend.modules.design.repository.DesignRepository;
import com.backend.backend.modules.design.repository.PlacedFurnitureRepository;
import com.backend.backend.modules.furniture.engine.BoundaryValidator;
import com.backend.backend.modules.furniture.engine.CollisionEngine;
import com.backend.backend.modules.furniture.entity.FurnitureItem;
import com.backend.backend.modules.furniture.repository.FurnitureRepository;
import com.backend.backend.modules.room.dto.RoomRequest;
import com.backend.backend.modules.room.entity.Room;
import com.backend.backend.modules.room.repository.RoomRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DesignServiceTest {

    @Mock
    private DesignRepository designRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private PlacedFurnitureRepository placedFurnitureRepository;

    @Mock
    private FurnitureRepository furnitureRepository;

    @Mock
    private CollisionEngine collisionEngine;

    @Mock
    private BoundaryValidator boundaryValidator;

    @InjectMocks
    private DesignService designService;

    @Test
    void createPersistsDesignAndFurnitureWhenLayoutIsValid() {
        Room room = buildRoom();
        FurnitureItem sofa = buildFurniture("f-sofa", 2, 1);

        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> {
            Room persisted = invocation.getArgument(0);
            persisted.setId(11L);
            return persisted;
        });
        when(roomRepository.findById(11L)).thenReturn(Optional.of(room));
        when(furnitureRepository.findAllById(Set.of("f-sofa"))).thenReturn(List.of(sofa));
        when(boundaryValidator.withinBounds(any(Double.class), any(Double.class), any(Double.class), any(Double.class)))
                .thenReturn(true);
        when(placedFurnitureRepository.findByDesignId(any(String.class))).thenReturn(List.of());
        when(designRepository.save(any(Design.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateDesignRequest request = new CreateDesignRequest(
                "Studio Layout",
                buildRoomRequest(),
                List.of(new PlacedFurnitureDto(
                        "placed-1",
                        "f-sofa",
                        new PlacedFurnitureDto.Position(1, 0, 1),
                        0,
                        1,
                        "#ffffff",
                        0.4
                )),
                null,
                "user-1"
        );

        DesignResponse response = designService.create(request);

        assertThat(response.name()).isEqualTo("Studio Layout");
        assertThat(response.furniture()).hasSize(0);

        ArgumentCaptor<Design> designCaptor = ArgumentCaptor.forClass(Design.class);
        verify(designRepository).save(designCaptor.capture());
        assertThat(designCaptor.getValue().getName()).isEqualTo("Studio Layout");
        verify(placedFurnitureRepository).saveAll(any(List.class));
    }

    @Test
    void createRejectsOverlappingFurniture() {
        FurnitureItem chair = buildFurniture("f-chair", 1, 1);

        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> {
            Room persisted = invocation.getArgument(0);
            persisted.setId(11L);
            return persisted;
        });
        when(furnitureRepository.findAllById(Set.of("f-chair"))).thenReturn(List.of(chair));
        when(boundaryValidator.withinBounds(any(Double.class), any(Double.class), any(Double.class), any(Double.class)))
                .thenReturn(true);
        when(collisionEngine.collides(any(Double.class), any(Double.class), any(Double.class), any(Double.class), any(Double.class), any(Double.class), any(Double.class), any(Double.class)))
                .thenReturn(true);

        CreateDesignRequest request = new CreateDesignRequest(
                "Overlap Layout",
                buildRoomRequest(),
                List.of(
                        new PlacedFurnitureDto("placed-a", "f-chair", new PlacedFurnitureDto.Position(1, 0, 1), 0, 1, "#ffffff", 0.2),
                        new PlacedFurnitureDto("placed-b", "f-chair", new PlacedFurnitureDto.Position(1, 0, 1), 0, 1, "#ffffff", 0.2)
                ),
                null,
                "user-1"
        );

        assertThatThrownBy(() -> designService.create(request))
                .isInstanceOf(FurnitureOverlapException.class);

        verify(placedFurnitureRepository, never()).saveAll(any(List.class));
    }

    private static RoomRequest buildRoomRequest() {
        return new RoomRequest(
                "room-1",
                "Living",
                6,
                5,
                3,
                "rectangular",
                "#f5f5f4",
                "wood",
                "#d4a574",
                "#ffffff"
        );
    }

    private static Room buildRoom() {
        Room room = new Room();
        room.setId(11L);
        room.setName("Living");
        room.setWidth(6);
        room.setLength(5);
        room.setHeight(3);
        room.setShape("rectangular");
        room.setWallColor("#f5f5f4");
        room.setFloorType("wood");
        room.setFloorColor("#d4a574");
        room.setCeilingColor("#ffffff");
        return room;
    }

    private static FurnitureItem buildFurniture(String id, double width, double length) {
        FurnitureItem item = new FurnitureItem();
        item.setId(id);
        item.setName("Item");
        item.setCategory("seating");
        item.setDefaultWidth(width);
        item.setDefaultLength(length);
        item.setDefaultHeight(1);
        item.setColor("#cccccc");
        return item;
    }
}
