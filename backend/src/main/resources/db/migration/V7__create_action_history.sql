CREATE TABLE IF NOT EXISTS action_history (
    id VARCHAR(64) PRIMARY KEY,
    design_id VARCHAR(64) NOT NULL,
    payload TEXT,
    created_at BIGINT
);
