import cron from 'node-cron';
import { PostStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';
import { config } from '../config';

/**
 * Scheduler — runs every minute, picks up posts whose scheduledAt
 * has passed and status is SCHEDULED, then "publishes" them.
 *
 * In production you would call each platform's API here.
 * The pattern is: mark PUBLISHING → call API → mark PUBLISHED or FAILED.
 */
export function startScheduler(): void {
  if (!config.scheduler.enabled) {
    logger.info('Scheduler disabled via config');
    return;
  }

  cron.schedule(config.scheduler.cron, async () => {
    await runSchedulerTick();
  });

  logger.info(`Scheduler started (cron: ${config.scheduler.cron})`);
}

export async function runSchedulerTick(): Promise<void> {
  const now = new Date();

  // Find all posts due for publishing
  const duePosts = await prisma.post.findMany({
    where: {
      status: PostStatus.SCHEDULED,
      scheduledAt: { lte: now },
    },
    include: {
      targets: {
        include: { socialAccount: true },
      },
    },
    take: 50, // process in batches
  });

  if (duePosts.length === 0) return;

  logger.info(`Scheduler: processing ${duePosts.length} post(s)`);

  for (const post of duePosts) {
    await publishPost(post);
  }
}

async function publishPost(post: Awaited<ReturnType<typeof prisma.post.findMany>>[number] & {
  targets: Array<{ id: string; socialAccountId: string; platform: string }>;
}): Promise<void> {
  try {
    // Mark as PUBLISHING to prevent double-processing
    await prisma.post.update({
      where: { id: post.id },
      data: { status: PostStatus.PUBLISHING },
    });

    // Publish to each target platform
    const results = await Promise.allSettled(
      post.targets.map((target) => publishToplatform(post.id, target)),
    );

    const allSucceeded = results.every((r) => r.status === 'fulfilled');
    const anySucceeded = results.some((r) => r.status === 'fulfilled');

    const finalStatus: PostStatus = allSucceeded
      ? PostStatus.PUBLISHED
      : anySucceeded
      ? PostStatus.PUBLISHED   // partial success — still mark published
      : PostStatus.FAILED;

    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: finalStatus,
        publishedAt: finalStatus === PostStatus.PUBLISHED ? new Date() : undefined,
        failureReason: finalStatus === PostStatus.FAILED ? 'All platform publishes failed' : undefined,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        workspaceId: post.workspaceId,
        userId: post.authorId,
        type: finalStatus === PostStatus.PUBLISHED ? 'POST_PUBLISHED' : 'POST_FAILED',
        description:
          finalStatus === PostStatus.PUBLISHED
            ? `"${post.title}" published successfully`
            : `"${post.title}" failed to publish`,
        metadata: { postId: post.id },
      },
    });

    logger.info(`Post ${post.id} → ${finalStatus}`);
  } catch (err) {
    logger.error(`Scheduler error for post ${post.id}`, { error: err });

    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: PostStatus.FAILED,
        failureReason: err instanceof Error ? err.message : 'Unknown error',
      },
    }).catch(() => {});
  }
}

/**
 * Stub for platform-specific publishing.
 * Replace each case with the real social platform SDK/API call.
 */
async function publishToplatform(
  postId: string,
  target: { id: string; platform: string },
): Promise<void> {
  logger.debug(`Publishing post ${postId} to ${target.platform}`);

  // Simulate network latency in dev
  if (config.isDev) {
    await new Promise((r) => setTimeout(r, 100));
  }

  // TODO: integrate real platform APIs
  // switch (target.platform) {
  //   case 'TWITTER':   await twitterClient.post(...); break;
  //   case 'FACEBOOK':  await facebookClient.post(...); break;
  //   case 'INSTAGRAM': await instagramClient.post(...); break;
  //   case 'LINKEDIN':  await linkedinClient.post(...); break;
  // }

  // Mark individual target as published
  await prisma.postTarget.update({
    where: { id: target.id },
    data: {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
}
