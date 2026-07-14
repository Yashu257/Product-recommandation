import { Response, NextFunction } from 'express';
import { WorkspaceMemberRole } from '@prisma/client';
import { AuthRequest } from '../types';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import prisma from '../lib/prisma';

const ROLE_HIERARCHY: Record<WorkspaceMemberRole, number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  OWNER: 3,
};

/**
 * Resolves the workspace from `req.params.workspaceId` or `req.params.slug`
 * and attaches `req.workspace` with the member's role.
 */
export function requireWorkspaceMember(minRole: WorkspaceMemberRole = 'VIEWER') {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = req.params.workspaceId ?? req.params.slug;
      if (!identifier) throw new NotFoundError('Workspace');

      // Support lookup by either cuid or slug
      const workspace = await prisma.workspace.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        select: { id: true, slug: true },
      });

      if (!workspace) throw new NotFoundError('Workspace');

      const member = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: req.user.id,
          },
        },
        select: { role: true },
      });

      if (!member) throw new ForbiddenError('You are not a member of this workspace');

      if (ROLE_HIERARCHY[member.role] < ROLE_HIERARCHY[minRole]) {
        throw new ForbiddenError(`Requires ${minRole} role or higher`);
      }

      req.workspace = { id: workspace.id, slug: workspace.slug, role: member.role };
      next();
    } catch (err) {
      next(err);
    }
  };
}

/** Shorthand guards */
export const requireEditor = requireWorkspaceMember('EDITOR');
export const requireAdmin  = requireWorkspaceMember('ADMIN');
export const requireOwner  = requireWorkspaceMember('OWNER');
