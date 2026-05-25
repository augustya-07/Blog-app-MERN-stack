import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function sendAuth(res, user, status = 200) {
  const token = signToken(user);
  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;

  res.status(status).json({ token, user: safeUser });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  sendAuth(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendAuth(res, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name ?? req.user.name,
    bio: req.body.bio ?? req.user.bio,
    avatar: req.body.avatar ?? req.user.avatar
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.json(user);
});
