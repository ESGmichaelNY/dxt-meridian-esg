import { pgTable, index, text, boolean, timestamp, unique, check, foreignKey, uuid, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const organizationRole = pgEnum("organization_role", ['owner', 'admin', 'member', 'viewer'])


export const profiles = pgTable("profiles", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	department: text(),
	isVerified: boolean("is_verified").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_profiles_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const organizations = pgTable("organizations", {
	id: text().default(uuid_generate_v4()).primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	industry: text(),
	size: text(),
	website: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_organizations_clerk_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
	unique("organizations_slug_key").on(table.slug),
	check("organizations_size_check", sql`size = ANY (ARRAY['small'::text, 'medium'::text, 'large'::text, 'enterprise'::text])`),
]);

export const organizationMembers = pgTable("organization_members", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),
	role: organizationRole().default('member').notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_organization_members_org_id").using("btree", table.organizationId.asc().nullsLast().op("text_ops")),
	index("idx_organization_members_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "organization_members_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_members_organization_id_fkey"
		}).onDelete("cascade"),
	unique("organization_members_organization_id_user_id_key").on(table.organizationId, table.userId),
]);

export const organizationInvitations = pgTable("organization_invitations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	email: text().notNull(),
	role: organizationRole().default('member').notNull(),
	token: uuid().default(sql`uuid_generate_v4()`).notNull(),
	invitedBy: uuid("invited_by").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '7 days'::interval)`).notNull(),
	acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_organization_invitations_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_organization_invitations_token").using("btree", table.token.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [users.id],
			name: "organization_invitations_invited_by_fkey"
		}),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_invitations_organization_id_fkey"
		}).onDelete("cascade"),
	unique("organization_invitations_token_key").on(table.token),
]);
