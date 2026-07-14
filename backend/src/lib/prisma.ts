import { PrismaClient } from '@prisma/client';
import { config } from '../config';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse client in development to avoid exhausting connections during hot reload
const prisma =
  global.__prisma ??
  new PrismaClient({
    log: config.isDev ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (config.isDev) {
  global.__prisma = prisma;
}

export default prisma;
