import slugify from 'slugify';
import mongoose from 'mongoose';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function splitTags(tags = '') {
  if (Array.isArray(tags)) return tags.map((tag) => tag.trim()).filter(Boolean);
  return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
}

async function makeUniqueSlug(title, currentId) {
  const base = slugify(title, { lower: true, strict: true }) || 'post';
  let slug = base;
  let counter = 2;

  while (await Post.exists({ slug, _id: { $ne: currentId || new mongoose.Types.ObjectId() } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

function assertCanModifyPost(user, post) {
  const ownsPost = post.author._id
    ? post.author._id.equals(user._id)
    : post.author.equals(user._id);

  if (user.role !== 'admin' && !ownsPost) {
    const error = new Error('You can only modify your own posts');
    error.statusCode = 403;
    throw error;
  }
}

export const getPosts = asyncHandler(async (req, res) => {
  const { search, category, tag, author, featured } = req.query;
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 9), 1), 30);

  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (author) filter.author = author;
  if (featured === 'true') filter.featured = true;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(filter)
  ]);

  res.json({
    posts,
    total,
    page,
    pages: Math.ceil(total / limit) || 1
  });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('author', 'name avatar role bio')
    .populate('comments.author', 'name avatar role');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json(post);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name avatar role bio');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  assertCanModifyPost(req.user, post);
  res.json(post);
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImage, category, featured } = req.body;

  if (!['author', 'admin'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Only authors and admins can publish posts');
  }

  const post = await Post.create({
    title,
    slug: await makeUniqueSlug(title),
    excerpt,
    content,
    coverImage,
    category,
    tags: splitTags(req.body.tags),
    featured: req.user.role === 'admin' ? Boolean(featured) : false,
    author: req.user._id
  });

  const populated = await post.populate('author', 'name avatar role');
  res.status(201).json(populated);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name avatar role');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  assertCanModifyPost(req.user, post);

  const fields = ['title', 'excerpt', 'content', 'coverImage', 'category'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) post[field] = req.body[field];
  });

  if (req.body.tags !== undefined) post.tags = splitTags(req.body.tags);
  if (req.body.title !== undefined) post.slug = await makeUniqueSlug(req.body.title, post._id);
  if (req.body.featured !== undefined && req.user.role === 'admin') {
    post.featured = Boolean(req.body.featured);
  }

  await post.save();
  res.json(await post.populate('author', 'name avatar role'));
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  assertCanModifyPost(req.user, post);
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.some((id) => id.equals(req.user._id));
  post.likes = alreadyLiked
    ? post.likes.filter((id) => !id.equals(req.user._id))
    : [...post.likes, req.user._id];

  await post.save();
  res.json({
    liked: !alreadyLiked,
    likeCount: post.likes.length
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({
    body: req.body.body,
    author: req.user._id
  });

  await post.save();
  const populated = await post.populate('comments.author', 'name avatar role');
  res.status(201).json(populated.comments.at(-1));
});

export const updateComment = asyncHandler(async (req, res) => {
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

  if (req.user.role !== 'admin' && !comment.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only edit your own comments');
  }

  comment.body = req.body.body;
  await post.save();
  res.json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
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

  if (req.user.role !== 'admin' && !comment.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only delete your own comments');
  }

  comment.deleteOne();
  await post.save();
  res.json({ message: 'Comment deleted' });
});
