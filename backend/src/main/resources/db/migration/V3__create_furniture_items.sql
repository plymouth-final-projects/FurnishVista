CREATE TABLE IF NOT EXISTS furniture_items (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    model_path VARCHAR(512),
    thumbnail VARCHAR(512),
    default_width DOUBLE PRECISION,
    default_length DOUBLE PRECISION,
    default_height DOUBLE PRECISION,
    color VARCHAR(32),
    description VARCHAR(512)
);
