import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      trim: true,
      maxlength: 1000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 140
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: 260
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    coverImage: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [commentSchema]
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', excerpt: 'text', content: 'text', category: 'text', tags: 'text' });

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

postSchema.virtual('likeCount').get(function likeCount() {
  return this.likes?.length || 0;
});

postSchema.virtual('commentCount').get(function commentCount() {
  return this.comments?.length || 0;
});

export const Post = mongoose.model('Post', postSchema);
