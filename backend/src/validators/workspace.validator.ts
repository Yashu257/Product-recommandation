import { z } from 'zod';

const roleEnum = z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']);

export const updateWorkspaceSchema = z.object({
  body: z.object({
    name:     z.string().min(2).max(80).optional(),
    slug:     z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only').optional(),
    timezone: z.string().max(60).optional(),
    logoUrl:  z.string().url().optional(),
  }),
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role:  roleEnum.default('EDITOR'),
  }),
});

export const updateMemberRoleSchema = z.object({
  params: z.object({ userId: z.string().cuid() }),
  body:   z.object({ role: roleEnum }),
});

export const memberIdSchema = z.object({
  params: z.object({ userId: z.string().cuid() }),
});

export const inviteTokenSchema = z.object({
  params: z.object({ token: z.string().cuid() }),
});
