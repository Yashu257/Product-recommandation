import { WorkspaceMemberRole, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors';

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  timezone?: string;
  logoUrl?: string;
}

export interface InviteMemberInput {
  email: string;
  role: WorkspaceMemberRole;
}

// ─────────────────────────────────────────────────────────────

export async function getWorkspace(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true, handle: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
      socialAccounts: {
        where: { isActive: true },
        orderBy: { platform: 'asc' },
      },
      brandVoice: true,
    },
  });
  if (!workspace) throw new NotFoundError('Workspace');
  return workspace;
}

export async function updateWorkspace(workspaceId: string, input: UpdateWorkspaceInput) {
  if (input.slug) {
    const conflict = await prisma.workspace.findFirst({
      where: { slug: input.slug, NOT: { id: workspaceId } },
    });
    if (conflict) throw new ConflictError('That workspace URL is already taken');
  }

  return prisma.workspace.update({
    where: { id: workspaceId },
    data: input,
  });
}

export async function getMembers(workspaceId: string) {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, handle: true } },
    },
    orderBy: { joinedAt: 'asc' },
  });
}

export async function updateMemberRole(
  workspaceId: string,
  targetUserId: string,
  requesterId: string,
  newRole: WorkspaceMemberRole,
) {
  // Cannot change your own role
  if (targetUserId === requesterId) throw new ForbiddenError('Cannot change your own role');

  // Cannot demote the owner
  const target = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
  });
  if (!target) throw new NotFoundError('Member');
  if (target.role === 'OWNER') throw new ForbiddenError('Cannot change the workspace owner\'s role');

  return prisma.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    data: { role: newRole },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function removeMember(workspaceId: string, targetUserId: string, requesterId: string) {
  if (targetUserId === requesterId) throw new ForbiddenError('Cannot remove yourself — transfer ownership first');

  const target = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
  });
  if (!target) throw new NotFoundError('Member');
  if (target.role === 'OWNER') throw new ForbiddenError('Cannot remove the workspace owner');

  await prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
  });
}

export async function inviteMember(workspaceId: string, senderId: string, input: InviteMemberInput) {
  // Check if already a member
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    const alreadyMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: existingUser.id } },
    });
    if (alreadyMember) throw new ConflictError('User is already a member of this workspace');
  }

  // Expire any existing pending invite for this email
  await prisma.workspaceInvite.updateMany({
    where: { workspaceId, email: input.email, status: 'PENDING' },
    data: { status: 'EXPIRED' },
  });

  const invite = await prisma.workspaceInvite.create({
    data: {
      workspaceId,
      email: input.email,
      role: input.role,
      sentById: senderId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // TODO: send invite email via email service
  return invite;
}

export async function acceptInvite(token: string, userId: string) {
  const invite = await prisma.workspaceInvite.findUnique({ where: { token } });
  if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
    throw new NotFoundError('Invite (expired or invalid)');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email !== invite.email) {
    throw new ForbiddenError('This invite was sent to a different email address');
  }

  await prisma.$transaction([
    prisma.workspaceMember.create({
      data: { workspaceId: invite.workspaceId, userId, role: invite.role },
    }),
    prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    }),
  ]);

  return { workspaceId: invite.workspaceId };
}

export async function getWorkspaceStats(workspaceId: string) {
  const [total, scheduled, draft, published] = await Promise.all([
    prisma.post.count({ where: { workspaceId } }),
    prisma.post.count({ where: { workspaceId, status: 'SCHEDULED' } }),
    prisma.post.count({ where: { workspaceId, status: 'DRAFT' } }),
    prisma.post.count({ where: { workspaceId, status: 'PUBLISHED' } }),
  ]);

  return { total, scheduled, draft, published };
}

export async function getActivityFeed(workspaceId: string, limit = 20) {
  return prisma.activityLog.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}
