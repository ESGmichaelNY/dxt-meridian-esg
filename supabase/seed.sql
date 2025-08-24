-- Seed file for local development
-- This file contains sample data for testing
-- DO NOT use this in production

-- Only run if tables exist (migrations have been applied)
DO $$
BEGIN
  -- Check if organizations table exists before inserting
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') THEN
    -- Insert test organizations
    INSERT INTO organizations (id, name, slug, industry, size, created_at, updated_at)
    VALUES 
      ('00000000-0000-0000-0000-000000000001', 'Test Corporation', 'test-corp', 'Technology', 'large', NOW(), NOW()),
      ('00000000-0000-0000-0000-000000000002', 'Demo Industries', 'demo-ind', 'Manufacturing', 'medium', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Note: Additional seed data will be added as tables are created