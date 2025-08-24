-- Seed file for local development
-- This file contains sample data for testing
-- DO NOT use this in production

-- Insert test organizations
INSERT INTO organizations (id, name, slug, industry, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Test Corporation', 'test-corp', 'Technology', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Demo Industries', 'demo-ind', 'Manufacturing', NOW(), NOW());

-- Note: Additional seed data will be added as tables are created