-- Migration: Add Clerk metadata fields to existing tables
-- File: supabase/migrations/20240104000000_add_clerk_metadata_fields.sql

-- Add additional fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  username TEXT,
  profile_image_url TEXT,
  phone_number TEXT,
  timezone TEXT DEFAULT 'UTC',
  locale TEXT DEFAULT 'en-US',
  department TEXT,
  job_title TEXT,
  last_sign_in_at TIMESTAMPTZ,
  two_factor_enabled BOOLEAN DEFAULT false,
  public_metadata JSONB DEFAULT '{}',
  private_metadata JSONB DEFAULT '{}',
  unsafe_metadata JSONB DEFAULT '{}';

-- Add additional fields to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS
  image_url TEXT,
  logo_url TEXT,
  max_allowed_memberships INTEGER DEFAULT 100,
  members_count INTEGER DEFAULT 0,
  public_metadata JSONB DEFAULT '{}',
  private_metadata JSONB DEFAULT '{}';

-- Add ESG-specific columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS
  industry_sector TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  fiscal_year_end TEXT, -- Format: 'MM-DD'
  reporting_frameworks TEXT[], -- Array of framework codes
  certifications TEXT[], -- Array of certification names
  headquarters_location TEXT,
  employee_count INTEGER,
  annual_revenue DECIMAL(15,2),
  sustainability_goals JSONB DEFAULT '{}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_public_metadata ON profiles USING GIN (public_metadata);
CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry_sector);
CREATE INDEX IF NOT EXISTS idx_organizations_country ON organizations(country);
CREATE INDEX IF NOT EXISTS idx_organizations_public_metadata ON organizations USING GIN (public_metadata);

-- Add comments for documentation
COMMENT ON COLUMN profiles.public_metadata IS 'Clerk public metadata - visible to user';
COMMENT ON COLUMN profiles.private_metadata IS 'Clerk private metadata - backend only';
COMMENT ON COLUMN profiles.unsafe_metadata IS 'Clerk unsafe metadata - user editable';
COMMENT ON COLUMN organizations.reporting_frameworks IS 'Array of ESG frameworks: GRI, TCFD, SASB, CDP, etc';
COMMENT ON COLUMN organizations.fiscal_year_end IS 'Format: MM-DD, e.g., 12-31 for December 31';

-- Create a view for enhanced organization profiles
CREATE OR REPLACE VIEW organization_profiles AS
SELECT 
  o.*,
  COUNT(DISTINCT om.user_id) as actual_member_count,
  array_agg(DISTINCT om.user_id) FILTER (WHERE om.role = 'owner') as owner_ids,
  array_agg(DISTINCT om.user_id) FILTER (WHERE om.role = 'admin') as admin_ids
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id
GROUP BY o.id;