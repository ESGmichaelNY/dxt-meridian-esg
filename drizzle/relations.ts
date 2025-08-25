import { relations } from "drizzle-orm/relations";
import { organizations, organizationMembers, profiles, organizationInvitations, usersInAuth } from "./schema";

export const organizationMembersRelations = relations(organizationMembers, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id]
	}),
	profile: one(profiles, {
		fields: [organizationMembers.userId],
		references: [profiles.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	organizationMembers: many(organizationMembers),
	organizationInvitations: many(organizationInvitations),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	organizationMembers: many(organizationMembers),
}));

export const organizationInvitationsRelations = relations(organizationInvitations, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationInvitations.organizationId],
		references: [organizations.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [organizationInvitations.invitedBy],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	organizationInvitations: many(organizationInvitations),
}));