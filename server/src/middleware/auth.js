import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission for this action');
    }

    next();
  };
}
