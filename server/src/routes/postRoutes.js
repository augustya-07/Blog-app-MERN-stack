import express from 'express';
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  getPostById,
  getPosts,
  toggleLike,
  updateComment,
  updatePost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

export const postRoutes = express.Router();

postRoutes.get('/', getPosts);
postRoutes.get('/id/:id', protect, getPostById);
postRoutes.get('/:slug', getPost);
postRoutes.post('/', protect, createPost);
postRoutes.put('/:id', protect, updatePost);
postRoutes.delete('/:id', protect, deletePost);
postRoutes.post('/:id/like', protect, toggleLike);
postRoutes.post('/:id/comments', protect, addComment);
postRoutes.put('/:postId/comments/:commentId', protect, updateComment);
postRoutes.delete('/:postId/comments/:commentId', protect, deleteComment);
