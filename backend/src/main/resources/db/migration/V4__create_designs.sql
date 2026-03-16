CREATE TABLE IF NOT EXISTS designs (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    room_id VARCHAR(64),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    thumbnail VARCHAR(512),
    designer_id VARCHAR(64)
);
