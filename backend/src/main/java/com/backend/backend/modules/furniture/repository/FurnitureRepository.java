package com.backend.backend.modules.furniture.repository;

import com.backend.backend.modules.furniture.entity.FurnitureItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FurnitureRepository {

    public List<FurnitureItem> findAll() {
        return List.of(
                FurnitureItem.builder().id("fur-1").name("Small Sofa").category("seating").modelPath("/models/Couch Small.glb")
                        .thumbnail("/images/chair-thumb.png").defaultWidth(0.6).defaultLength(0.5).defaultHeight(0.6)
                        .color("#8B7355").description("Compact two-seater sofa").build(),
                FurnitureItem.builder().id("fur-2").name("Desk").category("tables").modelPath("/models/Desk.glb")
                        .thumbnail("/images/desk-thumb.png").defaultWidth(0.6).defaultLength(0.6).defaultHeight(0.7)
                        .color("#654321").description("Wooden work desk").build(),
                FurnitureItem.builder().id("fur-3").name("Night Stand").category("tables").modelPath("/models/Night Stand.glb")
                        .thumbnail("/images/drawer-thumb.png").defaultWidth(0.5).defaultLength(0.4).defaultHeight(0.55)
                        .color("#D4A574").description("Bedside night stand with drawer").build(),
                FurnitureItem.builder().id("fur-4").name("Wide Sofa").category("seating").modelPath("/models/Couch Wide.glb")
                        .thumbnail("/images/sofa-thumb.png").defaultWidth(1).defaultLength(0.9).defaultHeight(0.6)
                        .color("#4A6741").description("Large three-seater sofa").build(),
                FurnitureItem.builder().id("fur-5").name("Wardrobe").category("storage").modelPath("/models/Closet.glb")
                        .thumbnail("/images/closet-thumb.png").defaultWidth(1).defaultLength(0.9).defaultHeight(2.0)
                        .color("#8B6914").description("Full-height wardrobe closet").build(),
                FurnitureItem.builder().id("fur-6").name("Floor Lamp").category("lighting").modelPath("/models/Lamp Round Floor.glb")
                        .thumbnail("/images/lamp-thumb.png").defaultWidth(0.4).defaultLength(0.4).defaultHeight(1.6)
                        .color("#2C2C2C").description("Modern round floor lamp").build(),
                FurnitureItem.builder().id("fur-7").name("Table").category("tables").modelPath("/models/Table.glb")
                        .thumbnail("/images/table-thumb.png").defaultWidth(1).defaultLength(0.75).defaultHeight(0.75)
                        .color("#A0522D").description("Rectangular dining table").build(),
                FurnitureItem.builder().id("fur-8").name("Double Bed").category("seating").modelPath("/models/Bed Double.glb")
                        .thumbnail("/images/bed-thumb.png").defaultWidth(1).defaultLength(1.5).defaultHeight(0.4)
                        .color("#8B7355").description("Full-size double bed with headboard").build()
        );
    }
}
