CREATE TYPE "public"."organization_size" AS ENUM('small', 'medium', 'large', 'enterprise');--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_slug_key";--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organization_id_user_id_key";--> statement-breakpoint
ALTER TABLE "organization_invitations" DROP CONSTRAINT "organization_invitations_token_key";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_size_check";--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organization_id_fkey";
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "organization_invitations" DROP CONSTRAINT "organization_invitations_organization_id_fkey";
--> statement-breakpoint
ALTER TABLE "organization_invitations" DROP CONSTRAINT "organization_invitations_invited_by_fkey";
--> statement-breakpoint
DROP INDEX "idx_profiles_email";--> statement-breakpoint
DROP INDEX "idx_organization_members_org_id";--> statement-breakpoint
DROP INDEX "idx_organization_members_user_id";--> statement-breakpoint
DROP INDEX "idx_organization_invitations_email";--> statement-breakpoint
DROP INDEX "idx_organization_invitations_token";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "organization_members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "token" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "invited_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_members_organization_id_user_id_key" ON "organization_members" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_email" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_organization_members_org_id" ON "organization_members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_organization_members_user_id" ON "organization_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_organization_invitations_email" ON "organization_invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_organization_invitations_token" ON "organization_invitations" USING btree ("token");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_token_unique" UNIQUE("token");