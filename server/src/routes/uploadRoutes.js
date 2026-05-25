import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const uploadRoutes = express.Router();

uploadRoutes.post('/image', protect, upload.single('image'), uploadImage);
