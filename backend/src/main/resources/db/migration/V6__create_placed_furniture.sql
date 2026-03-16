CREATE TABLE IF NOT EXISTS placed_furniture (
    id VARCHAR(64) PRIMARY KEY,
    design_id VARCHAR(64) NOT NULL,
    furniture_id VARCHAR(64) NOT NULL,
    position_x DOUBLE PRECISION,
    position_y DOUBLE PRECISION,
    position_z DOUBLE PRECISION,
    rotation DOUBLE PRECISION,
    scale DOUBLE PRECISION,
    color VARCHAR(32),
    shading DOUBLE PRECISION
);
