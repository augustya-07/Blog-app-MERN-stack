import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});
