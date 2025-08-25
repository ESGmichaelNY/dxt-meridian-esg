-- First, drop ALL existing policies
DROP POLICY IF EXISTS "Users can view all profiles in their organizations" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON organizations;

DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;
DROP POLICY IF EXISTS "Admins can manage organization members" ON organization_members;

DROP POLICY IF EXISTS "Users can view invitations for their organizations" ON organization_invitations;
DROP POLICY IF EXISTS "Admins can create invitations" ON organization_invitations;

-- Drop the old Supabase auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop foreign key constraints that depend on the id column
ALTER TABLE organization_members
  DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey;

ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Modify profiles table to use Clerk user IDs (strings instead of UUIDs)
ALTER TABLE profiles 
  ALTER COLUMN id TYPE text USING id::text;

-- Update organization_members to use text IDs
ALTER TABLE organization_members
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- Add foreign key back to profiles
ALTER TABLE organization_members
  ADD CONSTRAINT organization_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create a new function to handle Clerk users
CREATE OR REPLACE FUNCTION public.ensure_profile_exists(
  p_user_id text,
  p_email text,
  p_full_name text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (p_user_id, p_email, p_full_name)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Temporarily disable RLS for development
-- In production, you'd implement proper session handling with Clerk
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations DISABLE ROW LEVEL SECURITY;