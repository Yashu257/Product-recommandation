import { AITone } from '@prisma/client';
import prisma from '../lib/prisma';

export interface UpdateBrandVoiceInput {
  defaultTone?: AITone;
  championWords?: string[];
  avoidWords?: string[];
  description?: string;
}

export async function getBrandVoice(workspaceId: string) {
  return prisma.brandVoice.upsert({
    where: { workspaceId },
    update: {},
    create: { workspaceId },
  });
}

export async function updateBrandVoice(workspaceId: string, input: UpdateBrandVoiceInput) {
  return prisma.brandVoice.upsert({
    where: { workspaceId },
    update: input,
    create: { workspaceId, ...input },
  });
}

/**
 * Analyses published posts to compute a voice match score.
 * In production this would call an AI model to compare post tone
 * against the brand voice profile.
 */
export async function trainBrandVoice(workspaceId: string) {
  const publishedPosts = await prisma.post.count({
    where: { workspaceId, status: 'PUBLISHED' },
  });

  // Stub: increment analyzed count and bump score
  const updated = await prisma.brandVoice.upsert({
    where: { workspaceId },
    update: {
      postsAnalyzed: publishedPosts,
      voiceMatchScore: Math.min(99, 70 + publishedPosts * 0.5),
    },
    create: {
      workspaceId,
      postsAnalyzed: publishedPosts,
      voiceMatchScore: 70,
    },
  });

  return updated;
}
