DROP TABLE IF EXISTS dispatches;
DROP TABLE IF EXISTS market_observations;
DROP TABLE IF EXISTS markets;
DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    base_location VARCHAR(100) NOT NULL
);

CREATE TABLE markets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    market_type VARCHAR(50)
);

CREATE TABLE market_observations (
    id SERIAL PRIMARY KEY,
    market_id INTEGER REFERENCES markets(id),
    produce VARCHAR(50) NOT NULL,
    observation_date TIMESTAMP NOT NULL,
    price NUMERIC(10, 2),
    arrival_volume NUMERIC(10, 2),
    demand_signal VARCHAR(50)
);

CREATE TABLE dispatches (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    produce VARCHAR(50) NOT NULL,
    quantity NUMERIC(10, 2),
    quality_grade VARCHAR(10),
    spoilage_window_hours INTEGER,
    recommended_market_id INTEGER REFERENCES markets(id),
    final_decision VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
