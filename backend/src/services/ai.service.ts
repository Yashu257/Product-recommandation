import OpenAI from 'openai';
import { AITone, AIModel, Platform } from '@prisma/client';
import prisma from '../lib/prisma';
import { config } from '../config';
import { ForbiddenError, AppError } from '../utils/errors';

const openai = new OpenAI({ apiKey: config.openai.apiKey });

// ─── Types ────────────────────────────────────────────────────

export interface GenerateCaptionInput {
  prompt: string;
  tone: AITone;
  platforms: Platform[];
  existingContent?: string;
  workspaceId: string;
  userId: string;
}

export interface GenerateHashtagsInput {
  content: string;
  platforms: Platform[];
  workspaceId: string;
  userId: string;
}

export interface ChatInput {
  conversationId?: string;
  message: string;
  model: AIModel;
  voiceStyle: AITone;
  platform?: Platform;
  workspaceId: string;
  userId: string;
}

export interface SuggestTimesInput {
  workspaceId: string;
  platforms: Platform[];
}

// ─── Credit management ────────────────────────────────────────

async function consumeCredits(workspaceId: string, amount: number): Promise<void> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { aiCredits: true, aiCreditsResetAt: true },
  });
  if (!workspace) throw new AppError('Workspace not found', 404);

  // Auto-reset credits if past reset date
  if (workspace.aiCreditsResetAt && workspace.aiCreditsResetAt < new Date()) {
    const plan = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { plan: true } });
    const resetAmount = plan?.plan === 'PRO' ? 10000 : plan?.plan === 'TEAM' ? 50000 : 1000;
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        aiCredits: resetAmount - amount,
        aiCreditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    return;
  }

  if (workspace.aiCredits < amount) {
    throw new ForbiddenError('Insufficient AI credits. Please upgrade your plan.');
  }

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { aiCredits: { decrement: amount } },
  });
}

// ─── Caption generation ───────────────────────────────────────

export async function generateCaption(input: GenerateCaptionInput): Promise<string> {
  await consumeCredits(input.workspaceId, 10);

  const brandVoice = await prisma.brandVoice.findUnique({ where: { workspaceId: input.workspaceId } });
  const platformList = input.platforms.map(p => p.toLowerCase()).join(', ');
  const toneDesc = toneDescription(input.tone);

  const systemPrompt = `You are Cadence AI, an expert social media copywriter.
Tone: ${toneDesc}
Platforms: ${platformList}
${brandVoice?.championWords?.length ? `Champion words to use: ${brandVoice.championWords.join(', ')}` : ''}
${brandVoice?.avoidWords?.length ? `Words to avoid: ${brandVoice.avoidWords.join(', ')}` : ''}
Write engaging, platform-appropriate content. Return only the post copy, no explanations.`;

  const userPrompt = input.existingContent
    ? `Rewrite this post: "${input.existingContent}"\n\nAdditional context: ${input.prompt}`
    : `Write a post about: ${input.prompt}`;

  const response = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    max_tokens: 500,
    temperature: 0.8,
  });

  await logAIActivity(input.workspaceId, input.userId, 'AI_GENERATED', 'Caption generated');
  return response.choices[0]?.message?.content?.trim() ?? '';
}

// ─── Hashtag generation ───────────────────────────────────────

export async function generateHashtags(input: GenerateHashtagsInput): Promise<string[]> {
  await consumeCredits(input.workspaceId, 5);

  const platformList = input.platforms.map(p => p.toLowerCase()).join(', ');

  const response = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [
      {
        role: 'system',
        content: `You are a social media hashtag expert. Generate relevant hashtags for ${platformList}. Return only a JSON array of hashtag strings (without the # symbol), e.g. ["marketing", "ai", "socialmedia"]. No explanation.`,
      },
      {
        role: 'user',
        content: `Generate 5-10 relevant hashtags for this post:\n\n${input.content}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.5,
  });

  try {
    const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Best time suggestions ────────────────────────────────────

export async function suggestBestTimes(input: SuggestTimesInput): Promise<{ platform: Platform; times: string[] }[]> {
  // In production this would analyze historical post performance
  // For now return data-driven defaults per platform
  const defaults: Record<Platform, string[]> = {
    TWITTER:   ['09:00', '12:00', '17:00', '20:00'],
    FACEBOOK:  ['09:00', '13:00', '16:00'],
    INSTAGRAM: ['11:00', '14:00', '19:00'],
    LINKEDIN:  ['08:00', '10:00', '12:00', '17:00'],
  };

  return input.platforms.map((p) => ({ platform: p, times: defaults[p] ?? [] }));
}

// ─── AI Chat ──────────────────────────────────────────────────

export async function chat(input: ChatInput) {
  await consumeCredits(input.workspaceId, 15);

  // Get or create conversation
  let conversation = input.conversationId
    ? await prisma.aIConversation.findFirst({
        where: { id: input.conversationId, workspaceId: input.workspaceId, userId: input.userId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
      })
    : null;

  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: {
        workspaceId: input.workspaceId,
        userId: input.userId,
        model: input.model,
        voiceStyle: input.voiceStyle,
        platform: input.platform,
        title: input.message.slice(0, 60),
      },
      include: { messages: true },
    });
  }

  const brandVoice = await prisma.brandVoice.findUnique({ where: { workspaceId: input.workspaceId } });

  const systemPrompt = buildChatSystemPrompt(input.voiceStyle, input.platform, brandVoice);

  // Build message history
  const history = conversation.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const response = await openai.chat.completions.create({
    model: modelToOpenAI(input.model),
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: input.message },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });

  const assistantContent = response.choices[0]?.message?.content?.trim() ?? '';
  const tokensUsed = response.usage?.total_tokens ?? 0;

  // Persist both messages
  await prisma.aIMessage.createMany({
    data: [
      { conversationId: conversation.id, role: 'user',      content: input.message,       tokensUsed: 0 },
      { conversationId: conversation.id, role: 'assistant', content: assistantContent, tokensUsed },
    ],
  });

  // Update conversation title if first message
  if (conversation.messages.length === 0) {
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { title: input.message.slice(0, 60) },
    });
  }

  return {
    conversationId: conversation.id,
    message: assistantContent,
    tokensUsed,
  };
}

export async function getConversations(workspaceId: string, userId: string) {
  return prisma.aIConversation.findMany({
    where: { workspaceId, userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, title: true, model: true, voiceStyle: true, platform: true,
      createdAt: true, updatedAt: true,
      _count: { select: { messages: true } },
    },
  });
}

export async function getConversation(workspaceId: string, userId: string, conversationId: string) {
  const conv = await prisma.aIConversation.findFirst({
    where: { id: conversationId, workspaceId, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conv) throw new Error('Conversation not found');
  return conv;
}

// ─── Helpers ──────────────────────────────────────────────────

function toneDescription(tone: AITone): string {
  const map: Record<AITone, string> = {
    PROFESSIONAL:   'Polished, authoritative, and formal',
    CASUAL:         'Warm, friendly, and conversational',
    BOLD:           'Direct, punchy, high-energy',
    WITTY:          'Clever, playful, with light humor',
    STORYTELLER:    'Narrative-driven, emotional, immersive',
    CONVERSATIONAL: 'Natural, human, approachable',
  };
  return map[tone] ?? 'Conversational';
}

function modelToOpenAI(model: AIModel): string {
  const map: Record<AIModel, string> = {
    CADENCE_4:     config.openai.model,
    CADENCE_4_PRO: 'gpt-4o',
    GPT_4O:        'gpt-4o',
  };
  return map[model] ?? config.openai.model;
}

function buildChatSystemPrompt(
  tone: AITone,
  platform: Platform | null | undefined,
  brandVoice: { championWords: string[]; avoidWords: string[]; description?: string | null } | null,
): string {
  return `You are Cadence AI, an expert social media strategist and copywriter.
Tone: ${toneDescription(tone)}
${platform ? `Primary platform: ${platform.toLowerCase()}` : 'Multi-platform context'}
${brandVoice?.description ? `Brand description: ${brandVoice.description}` : ''}
${brandVoice?.championWords?.length ? `Champion words: ${brandVoice.championWords.join(', ')}` : ''}
${brandVoice?.avoidWords?.length ? `Avoid these words: ${brandVoice.avoidWords.join(', ')}` : ''}

Help the user create, improve, and strategize their social media content.
When generating posts, format them clearly and make them ready to publish.
Be concise, actionable, and creative.`;
}

async function logAIActivity(
  workspaceId: string,
  userId: string,
  type: 'AI_GENERATED',
  description: string,
) {
  await prisma.activityLog.create({
    data: { workspaceId, userId, type, description },
  }).catch(() => { /* non-critical */ });
}
