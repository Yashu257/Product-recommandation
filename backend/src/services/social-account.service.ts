import { Platform } from '@prisma/client';
import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export interface ConnectAccountInput {
  platform: Platform;
  handle: string;
  displayName?: string;
  profileImageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}

export async function listAccounts(workspaceId: string) {
  return prisma.socialAccount.findMany({
    where: { workspaceId },
    orderBy: [{ platform: 'asc' }, { handle: 'asc' }],
  });
}

export async function connectAccount(workspaceId: string, input: ConnectAccountInput) {
  return prisma.socialAccount.upsert({
    where: {
      workspaceId_platform_handle: {
        workspaceId,
        platform: input.platform,
        handle: input.handle,
      },
    },
    update: {
      displayName:     input.displayName,
      profileImageUrl: input.profileImageUrl,
      accessToken:     input.accessToken,
      refreshToken:    input.refreshToken,
      tokenExpiresAt:  input.tokenExpiresAt,
      isActive:        true,
      lastSyncedAt:    new Date(),
    },
    create: {
      workspaceId,
      ...input,
      isActive: true,
      lastSyncedAt: new Date(),
    },
  });
}

export async function disconnectAccount(workspaceId: string, accountId: string) {
  const account = await prisma.socialAccount.findFirst({
    where: { id: accountId, workspaceId },
  });
  if (!account) throw new NotFoundError('Social account');

  return prisma.socialAccount.update({
    where: { id: accountId },
    data: { isActive: false, accessToken: null, refreshToken: null },
  });
}

export async function syncFollowers(workspaceId: string, accountId: string) {
  const account = await prisma.socialAccount.findFirst({
    where: { id: accountId, workspaceId, isActive: true },
  });
  if (!account) throw new NotFoundError('Social account');

  // TODO: call platform API to fetch real follower count
  // For now just update lastSyncedAt
  return prisma.socialAccount.update({
    where: { id: accountId },
    data: { lastSyncedAt: new Date() },
  });
}
