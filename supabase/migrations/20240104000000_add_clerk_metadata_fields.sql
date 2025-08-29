-- Migration: Add Clerk metadata fields to existing tables
-- File: supabase/migrations/20240104000000_add_clerk_metadata_fields.sql

-- Add additional fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS public_metadata JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS private_metadata JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unsafe_metadata JSONB DEFAULT '{}';

-- Add additional fields to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_allowed_memberships INTEGER DEFAULT 100;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS members_count INTEGER DEFAULT 0;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS public_metadata JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS private_metadata JSONB DEFAULT '{}';

-- Add ESG-specific columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS industry_sector TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS fiscal_year_end TEXT; -- Format: 'MM-DD'
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS reporting_frameworks TEXT[]; -- Array of framework codes
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS certifications TEXT[]; -- Array of certification names
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS headquarters_location TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS employee_count INTEGER;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS annual_revenue DECIMAL(15,2);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS sustainability_goals JSONB DEFAULT '{}';

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