import { Router } from 'express';
import * as workspaceController from '../controllers/workspace.controller';
import * as socialAccountController from '../controllers/social-account.controller';
import * as brandVoiceController from '../controllers/brand-voice.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  requireWorkspaceMember,
  requireEditor,
  requireAdmin,
} from '../middleware/workspace.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateWorkspaceSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  memberIdSchema,
  inviteTokenSchema,
} from '../validators/workspace.validator';

const router = Router({ mergeParams: true });

router.use(authenticate);

// ── Workspace ──────────────────────────────────────────────────
router.get('/',
  requireWorkspaceMember('VIEWER'),
  workspaceController.getWorkspace,
);

router.patch('/',
  requireAdmin,
  validate(updateWorkspaceSchema),
  workspaceController.updateWorkspace,
);

// ── Stats & Activity ───────────────────────────────────────────
router.get('/stats',
  requireWorkspaceMember('VIEWER'),
  workspaceController.getStats,
);

router.get('/activity',
  requireWorkspaceMember('VIEWER'),
  workspaceController.getActivityFeed,
);

// ── Members ────────────────────────────────────────────────────
router.get('/members',
  requireWorkspaceMember('VIEWER'),
  workspaceController.getMembers,
);

router.post('/members/invite',
  requireAdmin,
  validate(inviteMemberSchema),
  workspaceController.inviteMember,
);

router.patch('/members/:userId/role',
  requireAdmin,
  validate(updateMemberRoleSchema),
  workspaceController.updateMemberRole,
);

router.delete('/members/:userId',
  requireAdmin,
  validate(memberIdSchema),
  workspaceController.removeMember,
);

// ── Invites ────────────────────────────────────────────────────
// Accept invite — user must be authenticated but not yet a member
router.post('/invites/:token/accept',
  validate(inviteTokenSchema),
  workspaceController.acceptInvite,
);

// ── Social Accounts ────────────────────────────────────────────
router.get('/accounts',
  requireWorkspaceMember('VIEWER'),
  socialAccountController.listAccounts,
);

router.post('/accounts',
  requireAdmin,
  socialAccountController.connectAccount,
);

router.delete('/accounts/:accountId',
  requireAdmin,
  socialAccountController.disconnectAccount,
);

router.post('/accounts/:accountId/sync',
  requireEditor,
  socialAccountController.syncAccount,
);

// ── Brand Voice ────────────────────────────────────────────────
router.get('/brand-voice',
  requireWorkspaceMember('VIEWER'),
  brandVoiceController.getBrandVoice,
);

router.patch('/brand-voice',
  requireEditor,
  brandVoiceController.updateBrandVoice,
);

router.post('/brand-voice/train',
  requireEditor,
  brandVoiceController.trainBrandVoice,
);

export default router;
