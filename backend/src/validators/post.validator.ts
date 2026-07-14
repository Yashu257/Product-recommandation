import { z } from 'zod';

const platformEnum = z.enum(['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN']);
const statusEnum   = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED']);

export const createPostSchema = z.object({
  body: z.object({
    title:          z.string().min(1).max(200),
    content:        z.string().min(1).max(5000),
    hashtags:       z.array(z.string().max(100)).max(30).optional(),
    platforms:      z.array(platformEnum).min(1),
    scheduledAt:    z.string().datetime().optional(),
    isAIGenerated:  z.boolean().optional(),
    aiPrompt:       z.string().max(500).optional(),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({ postId: z.string().cuid() }),
  body: z.object({
    title:       z.string().min(1).max(200).optional(),
    content:     z.string().min(1).max(5000).optional(),
    hashtags:    z.array(z.string().max(100)).max(30).optional(),
    platforms:   z.array(platformEnum).min(1).optional(),
    scheduledAt: z.string().datetime().nullable().optional(),
    status:      statusEnum.optional(),
  }),
});

export const rescheduleSchema = z.object({
  params: z.object({ postId: z.string().cuid() }),
  body: z.object({
    scheduledAt: z.string().datetime(),
  }),
});

export const postIdSchema = z.object({
  params: z.object({ postId: z.string().cuid() }),
});

export const listPostsSchema = z.object({
  query: z.object({
    status:   statusEnum.optional(),
    platform: platformEnum.optional(),
    search:   z.string().max(200).optional(),
    from:     z.string().datetime().optional(),
    to:       z.string().datetime().optional(),
    page:     z.string().regex(/^\d+$/).optional(),
    limit:    z.string().regex(/^\d+$/).optional(),
  }),
});
