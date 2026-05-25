import express from 'express';
import {
  deleteAnyComment,
  deleteUser,
  getStats,
  listPostsForAdmin,
  listUsers,
  updateUserRole
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';
import { deletePost } from '../controllers/postController.js';

export const adminRoutes = express.Router();

adminRoutes.use(protect, authorize('admin'));

adminRoutes.get('/stats', getStats);
adminRoutes.get('/users', listUsers);
adminRoutes.put('/users/:id/role', updateUserRole);
adminRoutes.delete('/users/:id', deleteUser);
adminRoutes.get('/posts', listPostsForAdmin);
adminRoutes.delete('/posts/:id', deletePost);
adminRoutes.delete('/posts/:postId/comments/:commentId', deleteAnyComment);
