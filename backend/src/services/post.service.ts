import { PostStatus, Platform, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { paginate } from '../utils/response';
import { PaginationMeta } from '../types';

export interface CreatePostInput {
  title: string;
  content: string;
  hashtags?: string[];
  platforms: Platform[];
  scheduledAt?: Date;
  isAIGenerated?: boolean;
  aiPrompt?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  hashtags?: string[];
  platforms?: Platform[];
  scheduledAt?: Date | null;
  status?: PostStatus;
}

export interface PostFilters {
  status?: PostStatus;
  platform?: Platform;
  search?: string;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────

export async function createPost(
  workspaceId: string,
  authorId: string,
  input: CreatePostInput,
) {
  // Resolve social accounts for the requested platforms
  const socialAccounts = await prisma.socialAccount.findMany({
    where: { workspaceId, platform: { in: input.platforms }, isActive: true },
    select: { id: true, platform: true },
  });

  const status: PostStatus = input.scheduledAt ? 'SCHEDULED' : 'DRAFT';

  const post = await prisma.post.create({
    data: {
      workspaceId,
      authorId,
      title: input.title,
      content: input.content,
      hashtags: input.hashtags ?? [],
      status,
      scheduledAt: input.scheduledAt,
      isAIGenerated: input.isAIGenerated ?? false,
      aiPrompt: input.aiPrompt,
      targets: {
        create: socialAccounts.map((sa) => ({
          socialAccountId: sa.id,
          platform: sa.platform,
          status,
        })),
      },
    },
    include: postInclude,
  });

  // Log activity
  await logActivity(workspaceId, authorId, 'POST_CREATED', `Post "${input.title}" created`, { postId: post.id });

  return post;
}

export async function listPosts(
  workspaceId: string,
  filters: PostFilters = {},
): Promise<{ posts: unknown[]; meta: PaginationMeta }> {
  const page  = Math.max(1, filters.page  ?? 1);
  const limit = Math.min(100, filters.limit ?? 20);
  const skip  = (page - 1) * limit;

  const where: Prisma.PostWhereInput = {
    workspaceId,
    ...(filters.status && { status: filters.status }),
    ...(filters.platform && { targets: { some: { platform: filters.platform } } }),
    ...(filters.search && {
      OR: [
        { title:   { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
    ...(filters.from || filters.to
      ? {
          scheduledAt: {
            ...(filters.from && { gte: filters.from }),
            ...(filters.to   && { lte: filters.to }),
          },
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, skip, take: limit, orderBy: { scheduledAt: 'asc' }, include: postInclude }),
    prisma.post.count({ where }),
  ]);

  return { posts, meta: paginate(page, limit, total) };
}

export async function getPost(workspaceId: string, postId: string) {
  const post = await prisma.post.findFirst({
    where: { id: postId, workspaceId },
    include: { ...postInclude, metrics: true },
  });
  if (!post) throw new NotFoundError('Post');
  return post;
}

export async function updatePost(
  workspaceId: string,
  postId: string,
  userId: string,
  input: UpdatePostInput,
) {
  const post = await prisma.post.findFirst({ where: { id: postId, workspaceId } });
  if (!post) throw new NotFoundError('Post');
  if (post.status === 'PUBLISHED') throw new ForbiddenError('Cannot edit a published post');

  const newStatus = input.scheduledAt
    ? 'SCHEDULED'
    : input.status ?? post.status;

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.post.update({
      where: { id: postId },
      data: {
        title:      input.title      ?? post.title,
        content:    input.content    ?? post.content,
        hashtags:   input.hashtags   ?? post.hashtags,
        scheduledAt: input.scheduledAt !== undefined ? input.scheduledAt : post.scheduledAt,
        status:     newStatus,
      },
      include: postInclude,
    });

    // Re-sync targets if platforms changed
    if (input.platforms) {
      await tx.postTarget.deleteMany({ where: { postId } });
      const socialAccounts = await tx.socialAccount.findMany({
        where: { workspaceId, platform: { in: input.platforms }, isActive: true },
        select: { id: true, platform: true },
      });
      await tx.postTarget.createMany({
        data: socialAccounts.map((sa) => ({
          postId,
          socialAccountId: sa.id,
          platform: sa.platform,
          status: newStatus,
        })),
      });
    }

    return p;
  });

  await logActivity(workspaceId, userId, 'POST_UPDATED', `Post "${updated.title}" updated`, { postId });
  return updated;
}

export async function deletePost(workspaceId: string, postId: string, userId: string) {
  const post = await prisma.post.findFirst({ where: { id: postId, workspaceId } });
  if (!post) throw new NotFoundError('Post');
  if (post.status === 'PUBLISHING') throw new ForbiddenError('Cannot delete a post that is currently publishing');

  await prisma.post.delete({ where: { id: postId } });
  await logActivity(workspaceId, userId, 'POST_DELETED', `Post "${post.title}" deleted`, { postId });
}

export async function duplicatePost(workspaceId: string, postId: string, userId: string) {
  const original = await prisma.post.findFirst({
    where: { id: postId, workspaceId },
    include: { targets: true },
  });
  if (!original) throw new NotFoundError('Post');

  const copy = await prisma.post.create({
    data: {
      workspaceId,
      authorId: userId,
      title:    `${original.title} (copy)`,
      content:  original.content,
      hashtags: original.hashtags,
      status:   'DRAFT',
      targets: {
        create: original.targets.map((t) => ({
          socialAccountId: t.socialAccountId,
          platform: t.platform,
          status: 'DRAFT' as PostStatus,
        })),
      },
    },
    include: postInclude,
  });

  await logActivity(workspaceId, userId, 'POST_DUPLICATED', `Post "${original.title}" duplicated`, { postId: copy.id });
  return copy;
}

export async function reschedulePost(
  workspaceId: string,
  postId: string,
  userId: string,
  scheduledAt: Date,
) {
  const post = await prisma.post.findFirst({ where: { id: postId, workspaceId } });
  if (!post) throw new NotFoundError('Post');
  if (post.status === 'PUBLISHED') throw new ForbiddenError('Cannot reschedule a published post');

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { scheduledAt, status: 'SCHEDULED' },
    include: postInclude,
  });

  await logActivity(workspaceId, userId, 'POST_SCHEDULED', `Post "${post.title}" rescheduled`, { postId, scheduledAt });
  return updated;
}

// ─── Shared include ───────────────────────────────────────────

const postInclude = {
  author: { select: { id: true, name: true, avatarUrl: true } },
  targets: {
    include: {
      socialAccount: { select: { id: true, handle: true, platform: true } },
    },
  },
  media: { orderBy: { order: 'asc' as const } },
} satisfies Prisma.PostInclude;

// ─── Activity helper ──────────────────────────────────────────

async function logActivity(
  workspaceId: string,
  userId: string,
  type: Parameters<typeof prisma.activityLog.create>[0]['data']['type'],
  description: string,
  metadata?: object,
) {
  await prisma.activityLog.create({
    data: { workspaceId, userId, type, description, metadata },
  }).catch(() => { /* non-critical */ });
}
