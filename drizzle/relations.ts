import { relations } from "drizzle-orm/relations";
import { profiles, organizationMembers, organizations, usersInAuth, organizationInvitations } from "./schema";

export const organizationMembersRelations = relations(organizationMembers, ({one}) => ({
	profile: one(profiles, {
		fields: [organizationMembers.userId],
		references: [profiles.id]
	}),
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id]
	}),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	organizationMembers: many(organizationMembers),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	organizationMembers: many(organizationMembers),
	organizationInvitations: many(organizationInvitations),
}));

export const organizationInvitationsRelations = relations(organizationInvitations, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [organizationInvitations.invitedBy],
		references: [usersInAuth.id]
	}),
	organization: one(organizations, {
		fields: [organizationInvitations.organizationId],
		references: [organizations.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	organizationInvitations: many(organizationInvitations),
}));