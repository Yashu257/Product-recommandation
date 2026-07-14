import { Response, NextFunction } from 'express';
import { AITone } from '@prisma/client';
import { AuthRequest } from '../types';
import * as brandVoiceService from '../services/brand-voice.service';
import { sendSuccess } from '../utils/response';

export async function getBrandVoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const brandVoice = await brandVoiceService.getBrandVoice(req.workspace!.id);
    sendSuccess(res, brandVoice);
  } catch (err) {
    next(err);
  }
}

export async function updateBrandVoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { defaultTone, championWords, avoidWords, description } = req.body;
    const brandVoice = await brandVoiceService.updateBrandVoice(req.workspace!.id, {
      defaultTone:   defaultTone as AITone | undefined,
      championWords,
      avoidWords,
      description,
    });
    sendSuccess(res, brandVoice, 'Brand voice updated');
  } catch (err) {
    next(err);
  }
}

export async function trainBrandVoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const brandVoice = await brandVoiceService.trainBrandVoice(req.workspace!.id);
    sendSuccess(res, brandVoice, 'Brand voice training complete');
  } catch (err) {
    next(err);
  }
}
