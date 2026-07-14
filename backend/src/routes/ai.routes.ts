import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireWorkspaceMember } from '../middleware/workspace.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  generateCaptionSchema,
  generateHashtagsSchema,
  chatSchema,
  conversationIdSchema,
} from '../validators/ai.validator';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireWorkspaceMember('EDITOR'));

// POST /workspaces/:workspaceId/ai/generate/caption
router.post('/generate/caption',
  validate(generateCaptionSchema),
  aiController.generateCaption,
);

// POST /workspaces/:workspaceId/ai/generate/hashtags
router.post('/generate/hashtags',
  validate(generateHashtagsSchema),
  aiController.generateHashtags,
);

// GET  /workspaces/:workspaceId/ai/suggest-times?platforms=TWITTER,LINKEDIN
router.get('/suggest-times',
  aiController.suggestBestTimes,
);

// POST /workspaces/:workspaceId/ai/chat
router.post('/chat',
  validate(chatSchema),
  aiController.chat,
);

// GET  /workspaces/:workspaceId/ai/conversations
router.get('/conversations',
  aiController.getConversations,
);

// GET  /workspaces/:workspaceId/ai/conversations/:conversationId
router.get('/conversations/:conversationId',
  validate(conversationIdSchema),
  aiController.getConversation,
);

export default router;
