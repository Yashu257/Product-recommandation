import { Response, NextFunction } from 'express';
import { AITone, AIModel, Platform } from '@prisma/client';
import { AuthRequest } from '../types';
import * as aiService from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function generateCaption(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { prompt, tone, platforms, existingContent } = req.body;
    const caption = await aiService.generateCaption({
      prompt,
      tone:            tone as AITone,
      platforms:       platforms as Platform[],
      existingContent,
      workspaceId:     req.workspace!.id,
      userId:          req.user.id,
    });
    sendSuccess(res, { caption });
  } catch (err) {
    next(err);
  }
}

export async function generateHashtags(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content, platforms } = req.body;
    const hashtags = await aiService.generateHashtags({
      content,
      platforms: platforms as Platform[],
      workspaceId: req.workspace!.id,
      userId:      req.user.id,
    });
    sendSuccess(res, { hashtags });
  } catch (err) {
    next(err);
  }
}

export async function suggestBestTimes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { platforms } = req.query;
    const platformList = (Array.isArray(platforms) ? platforms : [platforms]).filter(Boolean) as Platform[];
    const suggestions = await aiService.suggestBestTimes({
      workspaceId: req.workspace!.id,
      platforms:   platformList,
    });
    sendSuccess(res, suggestions);
  } catch (err) {
    next(err);
  }
}

export async function chat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { conversationId, message, model, voiceStyle, platform } = req.body;
    const result = await aiService.chat({
      conversationId,
      message,
      model:       model      as AIModel,
      voiceStyle:  voiceStyle as AITone,
      platform:    platform   as Platform | undefined,
      workspaceId: req.workspace!.id,
      userId:      req.user.id,
    });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversations = await aiService.getConversations(req.workspace!.id, req.user.id);
    sendSuccess(res, conversations);
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversation = await aiService.getConversation(
      req.workspace!.id,
      req.user.id,
      req.params.conversationId,
    );
    sendSuccess(res, conversation);
  } catch (err) {
    next(err);
  }
}
