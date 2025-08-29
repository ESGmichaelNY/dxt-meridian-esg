drop view if exists "public"."organization_profiles";

drop index if exists "public"."idx_organizations_country";

drop index if exists "public"."idx_organizations_industry";

drop index if exists "public"."idx_organizations_public_metadata";

drop index if exists "public"."idx_profiles_department";

drop index if exists "public"."idx_profiles_public_metadata";

drop index if exists "public"."idx_profiles_username";

alter table "public"."organizations" drop column "annual_revenue";

alter table "public"."organizations" drop column "certifications";

alter table "public"."organizations" drop column "country";

alter table "public"."organizations" drop column "employee_count";

alter table "public"."organizations" drop column "fiscal_year_end";

alter table "public"."organizations" drop column "headquarters_location";

alter table "public"."organizations" drop column "image_url";

alter table "public"."organizations" drop column "industry_sector";

alter table "public"."organizations" drop column "logo_url";

alter table "public"."organizations" drop column "max_allowed_memberships";

alter table "public"."organizations" drop column "members_count";

alter table "public"."organizations" drop column "private_metadata";

alter table "public"."organizations" drop column "public_metadata";

alter table "public"."organizations" drop column "reporting_frameworks";

alter table "public"."organizations" drop column "sustainability_goals";

alter table "public"."organizations" drop column "timezone";

alter table "public"."profiles" drop column "job_title";

alter table "public"."profiles" drop column "last_sign_in_at";

alter table "public"."profiles" drop column "locale";

alter table "public"."profiles" drop column "phone_number";

alter table "public"."profiles" drop column "private_metadata";

alter table "public"."profiles" drop column "profile_image_url";

alter table "public"."profiles" drop column "public_metadata";

alter table "public"."profiles" drop column "timezone";

alter table "public"."profiles" drop column "two_factor_enabled";

alter table "public"."profiles" drop column "unsafe_metadata";

alter table "public"."profiles" drop column "username";


