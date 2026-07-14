import { Request } from 'express';
import { User, Workspace, WorkspaceMemberRole } from '@prisma/client';

// ─── Augmented Express Request ────────────────────────────────
export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
  workspace?: {
    id: string;
    slug: string;
    role: WorkspaceMemberRole;
  };
}

// ─── JWT Payloads ─────────────────────────────────────────────
export interface AccessTokenPayload {
  sub: string;   // userId
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;   // userId
  jti: string;   // token id (stored in DB)
  iat?: number;
  exp?: number;
}

// ─── API Response Shapes ──────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ─── Service Result ───────────────────────────────────────────
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };
