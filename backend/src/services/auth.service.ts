import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken, expiryToMs } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { config } from '../config';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  handle: string | null;
  avatarUrl: string | null;
}

// ─────────────────────────────────────────────────────────────

export async function register(
  input: RegisterInput,
  meta: { userAgent?: string; ipAddress?: string } = {},
): Promise<{ user: AuthUser; tokens: AuthTokens; workspaceId: string }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('An account with that email already exists');

  const passwordHash = await bcrypt.hash(input.password, 12);

  // Create user + workspace in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
    });

    const workspaceName = input.workspaceName ?? `${input.name}'s Workspace`;
    const slug = slugify(workspaceName) + '-' + user.id.slice(0, 6);

    const workspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug,
        members: {
          create: { userId: user.id, role: 'OWNER' },
        },
      },
    });

    return { user, workspace };
  });

  const tokens = await issueTokens(result.user.id, result.user.email, meta);

  return {
    user: toAuthUser(result.user),
    tokens,
    workspaceId: result.workspace.id,
  };
}

export async function login(
  input: LoginInput,
  meta: { userAgent?: string; ipAddress?: string } = {},
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) throw new UnauthorizedError('Invalid email or password');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  const tokens = await issueTokens(user.id, user.email, meta);
  return { user: toAuthUser(user), tokens };
}

export async function refreshTokens(
  incomingRefreshToken: string,
  meta: { userAgent?: string; ipAddress?: string } = {},
): Promise<AuthTokens> {
  let payload;
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: incomingRefreshToken },
    include: { user: { select: { id: true, email: true, isActive: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token is invalid or expired');
  }

  if (!stored.user.isActive) throw new UnauthorizedError('Account deactivated');

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens(stored.user.id, stored.user.email, meta);
}

export async function logout(refreshToken: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revokedAt: new Date() },
  });
}

export async function logoutAll(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');
  return toAuthUser(user);
}

// ─── Helpers ──────────────────────────────────────────────────

async function issueTokens(
  userId: string,
  email: string,
  meta: { userAgent?: string; ipAddress?: string },
): Promise<AuthTokens> {
  const jti = uuidv4();
  const accessToken  = signAccessToken({ sub: userId, email });
  const refreshToken = signRefreshToken({ sub: userId, jti });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + expiryToMs(config.jwt.refreshExpiresIn)),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  });

  return { accessToken, refreshToken };
}

function toAuthUser(user: {
  id: string; name: string; email: string; handle: string | null; avatarUrl: string | null;
}): AuthUser {
  return { id: user.id, name: user.name, email: user.email, handle: user.handle, avatarUrl: user.avatarUrl };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
