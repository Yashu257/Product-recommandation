import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as postService from '../services/post.service';
import { sendSuccess } from '../utils/response';
import { Platform, PostStatus } from '@prisma/client';
import path from 'path';
import prisma from '../lib/prisma';

export async function createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const workspaceId = req.workspace!.id;
    const { title, content, hashtags, platforms, scheduledAt, isAIGenerated, aiPrompt } = req.body;

    const post = await postService.createPost(workspaceId, req.user.id, {
      title,
      content,
      hashtags,
      platforms: platforms as Platform[],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      isAIGenerated,
      aiPrompt,
    });

    // Attach uploaded media if any
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      await prisma.postMedia.createMany({
        data: (req.files as Express.Multer.File[]).map((file, i) => ({
          postId: post.id,
          url: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          filename: file.originalname,
          sizeBytes: file.size,
          order: i,
        })),
      });
    }

    sendSuccess(res, post, 'Post created', 201);
  } catch (err) {
    next(err);
  }
}

export async function listPosts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const workspaceId = req.workspace!.id;
    const { status, platform, search, from, to, page, limit } = req.query as Record<string, string>;

    const result = await postService.listPosts(workspaceId, {
      status:   status   as PostStatus | undefined,
      platform: platform as Platform   | undefined,
      search,
      from: from ? new Date(from) : undefined,
      to:   to   ? new Date(to)   : undefined,
      page:  page  ? parseInt(page,  10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    sendSuccess(res, result.posts, undefined, 200, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.getPost(req.workspace!.id, req.params.postId);
    sendSuccess(res, post);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, content, hashtags, platforms, scheduledAt, status } = req.body;
    const post = await postService.updatePost(
      req.workspace!.id,
      req.params.postId,
      req.user.id,
      {
        title, content, hashtags,
        platforms: platforms as Platform[] | undefined,
        scheduledAt: scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : undefined,
        status: status as PostStatus | undefined,
      },
    );
    sendSuccess(res, post, 'Post updated');
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await postService.deletePost(req.workspace!.id, req.params.postId, req.user.id);
    sendSuccess(res, null, 'Post deleted');
  } catch (err) {
    next(err);
  }
}

export async function duplicatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.duplicatePost(req.workspace!.id, req.params.postId, req.user.id);
    sendSuccess(res, post, 'Post duplicated', 201);
  } catch (err) {
    next(err);
  }
}

export async function reschedulePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { scheduledAt } = req.body;
    const post = await postService.reschedulePost(
      req.workspace!.id,
      req.params.postId,
      req.user.id,
      new Date(scheduledAt),
    );
    sendSuccess(res, post, 'Post rescheduled');
  } catch (err) {
    next(err);
  }
}
