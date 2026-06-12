-- Migration: 001_initial_schema.sql
-- Creates the initial tables for SIEM backend

-- Table: internal_infrastructure_assets
CREATE TABLE IF NOT EXISTS internal_infrastructure_assets (
    id                    SERIAL PRIMARY KEY,
    asset_name            VARCHAR(255) NOT NULL,
    host_identifier_local VARCHAR(50)  NOT NULL,
    department_owner      VARCHAR(100) NOT NULL,
    risk_level            VARCHAR(20)  NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical'))
);

-- Table: highlighted_ips
-- Stores suspicious external IPs flagged by security analysts.
CREATE TABLE IF NOT EXISTS highlighted_ips (
    id         SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    label      VARCHAR(255),               -- e.g. "Tor exit node", "Known botnet"
    reason     TEXT,                       -- free-text analyst note
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_highlighted_ips_ip ON highlighted_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_assets_host_ip     ON internal_infrastructure_assets(host_identifier_local);
CREATE INDEX IF NOT EXISTS idx_assets_department  ON internal_infrastructure_assets(department_owner);
CREATE INDEX IF NOT EXISTS idx_assets_risk        ON internal_infrastructure_assets(risk_level);
