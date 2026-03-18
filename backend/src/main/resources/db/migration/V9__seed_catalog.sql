INSERT INTO room_templates (id, name, description, thumbnail, width, length, height, shape, wall_color, floor_type, floor_color, ceiling_color)
VALUES
  ('101', 'Living Room', 'A spacious rectangular living room', '/images/living-room-template.png', 5, 4, 3, 'rectangular', '#f5f5f4', 'wood', '#d4a574', '#ffffff'),
  ('102', 'Bedroom', 'A cozy bedroom with carpet floor', '/images/bedroom-template.png', 4, 3.5, 2.8, 'rectangular', '#E8E0D5', 'carpet', '#8B8178', '#FFFFFF'),
  ('103', 'Dining Room', 'An elegant dining space with tile flooring', '/images/dining-room-template.png', 4, 3.5, 3, 'rectangular', '#FAF8F5', 'tile', '#C4B5A3', '#FFFFFF'),
  ('104', 'Kitchen', 'A modern kitchen with granite countertops', '/images/kitchen-template.png', 5, 4.3, 3, 'rectangular', '#FAF8F5', 'tile', '#C4B5A3', '#FFFFFF')
ON CONFLICT (id) DO NOTHING;

INSERT INTO furniture_items (id, name, category, model_path, thumbnail, default_width, default_length, default_height, color, description)
VALUES
  ('fur-1', 'Small Sofa', 'seating', '/models/Couch Small.glb', '/images/chair-thumb.png', 0.6, 0.5, 0.6, '#8B7355', 'Compact two-seater sofa'),
  ('fur-2', 'Desk', 'tables', '/models/Desk.glb', '/images/desk-thumb.png', 0.6, 0.6, 0.7, '#654321', 'Wooden work desk'),
  ('fur-3', 'Night Stand', 'tables', '/models/Night Stand.glb', '/images/drawer-thumb.png', 0.5, 0.4, 0.55, '#D4A574', 'Bedside night stand with drawer'),
  ('fur-4', 'Wide Sofa', 'seating', '/models/Couch Wide.glb', '/images/sofa-thumb.png', 1.0, 0.9, 0.6, '#4A6741', 'Large three-seater sofa'),
  ('fur-5', 'Wardrobe', 'storage', '/models/Closet.glb', '/images/closet-thumb.png', 1.0, 0.9, 2.0, '#8B6914', 'Full-height wardrobe closet'),
  ('fur-6', 'Floor Lamp', 'lighting', '/models/Lamp Round Floor.glb', '/images/lamp-thumb.png', 0.4, 0.4, 1.6, '#2C2C2C', 'Modern round floor lamp'),
  ('fur-7', 'Table', 'tables', '/models/Table.glb', '/images/table-thumb.png', 1.0, 0.75, 0.75, '#A0522D', 'Rectangular dining table'),
  ('fur-8', 'Double Bed', 'seating', '/models/Bed Double.glb', '/images/bed-thumb.png', 1.0, 1.5, 0.4, '#8B7355', 'Full-size double bed with headboard')
ON CONFLICT (id) DO NOTHING;
