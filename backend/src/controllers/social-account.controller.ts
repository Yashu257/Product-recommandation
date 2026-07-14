import { Response, NextFunction } from 'express';
import { Platform } from '@prisma/client';
import { AuthRequest } from '../types';
import * as socialAccountService from '../services/social-account.service';
import { sendSuccess } from '../utils/response';

export async function listAccounts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const accounts = await socialAccountService.listAccounts(req.workspace!.id);
    sendSuccess(res, accounts);
  } catch (err) {
    next(err);
  }
}

export async function connectAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { platform, handle, displayName, profileImageUrl, accessToken, refreshToken, tokenExpiresAt } = req.body;
    const account = await socialAccountService.connectAccount(req.workspace!.id, {
      platform:        platform as Platform,
      handle,
      displayName,
      profileImageUrl,
      accessToken,
      refreshToken,
      tokenExpiresAt:  tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
    });
    sendSuccess(res, account, 'Account connected', 201);
  } catch (err) {
    next(err);
  }
}

export async function disconnectAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = await socialAccountService.disconnectAccount(req.workspace!.id, req.params.accountId);
    sendSuccess(res, account, 'Account disconnected');
  } catch (err) {
    next(err);
  }
}

export async function syncAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = await socialAccountService.syncFollowers(req.workspace!.id, req.params.accountId);
    sendSuccess(res, account, 'Account synced');
  } catch (err) {
    next(err);
  }
}
