const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost',
      required: true,
    },
    replies: [
      {
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const forumPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isReported: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = { Comment, ForumPost };
