ALTER TABLE placed_furniture
ADD CONSTRAINT fk_placed_furniture_design
FOREIGN KEY (design_id) REFERENCES designs(id)
ON DELETE CASCADE;

ALTER TABLE placed_furniture
ADD CONSTRAINT fk_placed_furniture_item
FOREIGN KEY (furniture_id) REFERENCES furniture_items(id)
ON DELETE RESTRICT;
