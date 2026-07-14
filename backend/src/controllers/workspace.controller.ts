import { Response, NextFunction } from 'express';
import { WorkspaceMemberRole } from '@prisma/client';
import { AuthRequest } from '../types';
import * as workspaceService from '../services/workspace.service';
import { sendSuccess } from '../utils/response';

export async function getWorkspace(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const workspace = await workspaceService.getWorkspace(req.workspace!.id);
    sendSuccess(res, workspace);
  } catch (err) {
    next(err);
  }
}

export async function updateWorkspace(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, slug, timezone, logoUrl } = req.body;
    const workspace = await workspaceService.updateWorkspace(req.workspace!.id, { name, slug, timezone, logoUrl });
    sendSuccess(res, workspace, 'Workspace updated');
  } catch (err) {
    next(err);
  }
}

export async function getMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const members = await workspaceService.getMembers(req.workspace!.id);
    sendSuccess(res, members);
  } catch (err) {
    next(err);
  }
}

export async function updateMemberRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role } = req.body;
    const member = await workspaceService.updateMemberRole(
      req.workspace!.id,
      req.params.userId,
      req.user.id,
      role as WorkspaceMemberRole,
    );
    sendSuccess(res, member, 'Member role updated');
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await workspaceService.removeMember(req.workspace!.id, req.params.userId, req.user.id);
    sendSuccess(res, null, 'Member removed');
  } catch (err) {
    next(err);
  }
}

export async function inviteMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, role } = req.body;
    const invite = await workspaceService.inviteMember(req.workspace!.id, req.user.id, {
      email,
      role: role as WorkspaceMemberRole,
    });
    sendSuccess(res, invite, 'Invite sent', 201);
  } catch (err) {
    next(err);
  }
}

export async function acceptInvite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await workspaceService.acceptInvite(req.params.token, req.user.id);
    sendSuccess(res, result, 'Invite accepted');
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await workspaceService.getWorkspaceStats(req.workspace!.id);
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

export async function getActivityFeed(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const activity = await workspaceService.getActivityFeed(req.workspace!.id, limit);
    sendSuccess(res, activity);
  } catch (err) {
    next(err);
  }
}
