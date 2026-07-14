import { z } from 'zod';

const platformEnum  = z.enum(['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN']);
const toneEnum      = z.enum(['PROFESSIONAL', 'CASUAL', 'BOLD', 'WITTY', 'STORYTELLER', 'CONVERSATIONAL']);
const modelEnum     = z.enum(['CADENCE_4', 'CADENCE_4_PRO', 'GPT_4O']);

export const generateCaptionSchema = z.object({
  body: z.object({
    prompt:          z.string().min(1).max(500),
    tone:            toneEnum.default('CONVERSATIONAL'),
    platforms:       z.array(platformEnum).min(1),
    existingContent: z.string().max(5000).optional(),
  }),
});

export const generateHashtagsSchema = z.object({
  body: z.object({
    content:   z.string().min(1).max(5000),
    platforms: z.array(platformEnum).min(1),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    conversationId: z.string().cuid().optional(),
    message:        z.string().min(1).max(2000),
    model:          modelEnum.default('CADENCE_4'),
    voiceStyle:     toneEnum.default('CONVERSATIONAL'),
    platform:       platformEnum.optional(),
  }),
});

export const conversationIdSchema = z.object({
  params: z.object({ conversationId: z.string().cuid() }),
});
