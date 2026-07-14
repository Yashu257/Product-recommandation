import app from './app';
import { config } from './config';
import { logger } from './lib/logger';
import prisma from './lib/prisma';
import { startScheduler } from './services/scheduler.service';

async function bootstrap(): Promise<void> {
  // Verify DB connection
  await prisma.$connect();
  logger.info('Database connected');

  // Start post scheduler
  startScheduler();

  // Start HTTP server
  const server = app.listen(config.port, () => {
    logger.info(`Cadence API running on http://localhost:${config.port}${config.apiPrefix}`);
    logger.info(`Environment: ${config.env}`);
  });

  // ─── Graceful shutdown ────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Database disconnected');
      process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
