import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  boolean,
  pgEnum,
  uniqueIndex,
  index
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const organizationRoleEnum = pgEnum('organization_role', ['owner', 'admin', 'member', 'viewer'])
export const organizationSizeEnum = pgEnum('organization_size', ['small', 'medium', 'large', 'enterprise'])

// Organizations table
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(), // Clerk organization ID
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  industry: text('industry'),
  size: text('size'),
  website: text('website'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Profiles table (uses Clerk user IDs as text)
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  department: text('department'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_profiles_email').on(table.email),
}))

// Organization Members junction table
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: organizationRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueOrgUser: uniqueIndex('organization_members_organization_id_user_id_key').on(table.organizationId, table.userId),
  userIdIdx: index('idx_organization_members_user_id').on(table.userId),
  orgIdIdx: index('idx_organization_members_org_id').on(table.organizationId),
}))

// Organization Invitations table
export const organizationInvitations = pgTable('organization_invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: organizationRoleEnum('role').notNull().default('member'),
  token: uuid('token').defaultRandom().notNull().unique(),
  invitedBy: text('invited_by').notNull(), // Changed to text for Clerk user ID
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_organization_invitations_email').on(table.email),
  tokenIdx: index('idx_organization_invitations_token').on(table.token),
}))

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  invitations: many(organizationInvitations),
}))

export const profilesRelations = relations(profiles, ({ many }) => ({
  organizationMemberships: many(organizationMembers),
}))

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(profiles, {
    fields: [organizationMembers.userId],
    references: [profiles.id],
  }),
}))

export const organizationInvitationsRelations = relations(organizationInvitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationInvitations.organizationId],
    references: [organizations.id],
  }),
}))

// Type exports for TypeScript
export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type OrganizationMember = typeof organizationMembers.$inferSelect
export type NewOrganizationMember = typeof organizationMembers.$inferInsert
export type OrganizationInvitation = typeof organizationInvitations.$inferSelect
export type NewOrganizationInvitation = typeof organizationInvitations.$inferInsert