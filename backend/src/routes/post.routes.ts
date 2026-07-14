import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireWorkspaceMember, requireEditor } from '../middleware/workspace.middleware';
import { validate } from '../middleware/validate.middleware';
import { uploadMedia } from '../middleware/upload.middleware';
import {
  createPostSchema,
  updatePostSchema,
  rescheduleSchema,
  postIdSchema,
  listPostsSchema,
} from '../validators/post.validator';

const router = Router({ mergeParams: true }); // inherits :workspaceId from parent

router.use(authenticate);
router.use(requireWorkspaceMember('VIEWER'));

// GET  /workspaces/:workspaceId/posts
router.get('/',
  validate(listPostsSchema),
  postController.listPosts,
);

// POST /workspaces/:workspaceId/posts
router.post('/',
  requireEditor,
  uploadMedia,
  validate(createPostSchema),
  postController.createPost,
);

// GET  /workspaces/:workspaceId/posts/:postId
router.get('/:postId',
  validate(postIdSchema),
  postController.getPost,
);

// PATCH /workspaces/:workspaceId/posts/:postId
router.patch('/:postId',
  requireEditor,
  validate(updatePostSchema),
  postController.updatePost,
);

// DELETE /workspaces/:workspaceId/posts/:postId
router.delete('/:postId',
  requireEditor,
  validate(postIdSchema),
  postController.deletePost,
);

// POST /workspaces/:workspaceId/posts/:postId/duplicate
router.post('/:postId/duplicate',
  requireEditor,
  validate(postIdSchema),
  postController.duplicatePost,
);

// PATCH /workspaces/:workspaceId/posts/:postId/reschedule
router.patch('/:postId/reschedule',
  requireEditor,
  validate(rescheduleSchema),
  postController.reschedulePost,
);

export default router;
