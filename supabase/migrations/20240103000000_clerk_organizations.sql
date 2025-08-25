-- First drop foreign key constraints that reference organizations.id
ALTER TABLE organization_members
  DROP CONSTRAINT IF EXISTS organization_members_organization_id_fkey;

ALTER TABLE organization_invitations
  DROP CONSTRAINT IF EXISTS organization_invitations_organization_id_fkey;

-- Update organizations to use Clerk org IDs (text)
ALTER TABLE organizations 
  ALTER COLUMN id TYPE text USING id::text;

-- Update organization_members to use text IDs
ALTER TABLE organization_members
  ALTER COLUMN organization_id TYPE text USING organization_id::text;

-- Re-add the foreign key constraint
ALTER TABLE organization_members
  ADD CONSTRAINT organization_members_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_id ON organizations(id);

-- Create function to ensure organization exists
CREATE OR REPLACE FUNCTION public.ensure_organization_exists(
  p_org_id text,
  p_name text,
  p_slug text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO organizations (id, name, slug)
  VALUES (p_org_id, p_name, COALESCE(p_slug, LOWER(REPLACE(p_name, ' ', '-'))))
  ON CONFLICT (id) DO UPDATE
  SET 
    name = EXCLUDED.name,
    slug = COALESCE(EXCLUDED.slug, organizations.slug),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update organization_invitations to use text IDs
ALTER TABLE organization_invitations
  ALTER COLUMN organization_id TYPE text USING organization_id::text;

-- Re-add organization_invitations foreign key
ALTER TABLE organization_invitations
  ADD CONSTRAINT organization_invitations_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;