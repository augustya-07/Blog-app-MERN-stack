import fs from 'fs/promises';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  if (isCloudinaryConfigured()) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: process.env.CLOUDINARY_FOLDER || 'inkspire-blog',
      resource_type: 'image'
    });

    await fs.unlink(req.file.path).catch(() => {});

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id
    });
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});
