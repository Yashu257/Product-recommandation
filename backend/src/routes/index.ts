import { Router } from 'express';
import authRoutes      from './auth.routes';
import workspaceRoutes from './workspace.routes';
import postRoutes      from './post.routes';
import aiRoutes        from './ai.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth — public + protected
router.use('/auth', authRoutes);

// Workspace-scoped resources
// All routes below are nested under /workspaces/:workspaceId
router.use('/workspaces/:workspaceId',          workspaceRoutes);
router.use('/workspaces/:workspaceId/posts',    postRoutes);
router.use('/workspaces/:workspaceId/ai',       aiRoutes);

export default router;
