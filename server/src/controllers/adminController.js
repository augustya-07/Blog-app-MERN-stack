import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [users, posts, commentsAgg] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Post.aggregate([{ $project: { count: { $size: '$comments' } } }, { $group: { _id: null, total: { $sum: '$count' } } }])
  ]);

  res.json({
    users,
    posts,
    comments: commentsAgg[0]?.total || 0
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'author', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.equals(req.params.id)) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ message: 'User deleted' });
});

export const listPostsForAdmin = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'name email role')
    .sort({ createdAt: -1 });

  res.json(posts);
});

export const deleteAnyComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = post.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  comment.deleteOne();
  await post.save();
  res.json({ message: 'Comment deleted' });
});
