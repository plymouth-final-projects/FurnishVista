CREATE TABLE IF NOT EXISTS room_templates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(512),
    thumbnail VARCHAR(512),
    width DOUBLE PRECISION,
    length DOUBLE PRECISION,
    height DOUBLE PRECISION,
    shape VARCHAR(64),
    wall_color VARCHAR(32),
    floor_type VARCHAR(64),
    floor_color VARCHAR(32),
    ceiling_color VARCHAR(32)
);
