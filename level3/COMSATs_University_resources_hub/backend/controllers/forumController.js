const asyncHandler = require('express-async-handler');
const {
  ForumPost,
  Comment,
  CommentReply,
  ForumPostUpvote,
  ForumPostDownvote,
  ForumPostReport,
} = require('../models/ForumPost');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let where = { isReported: false };

  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  const posts = await ForumPost.findAll({
    where,
    include: {
      model: User,
      as: 'authorUser',
      attributes: ['id', 'name', 'email'],
    },
    order: [['createdAt', 'DESC']],
  });

  // Add upvotes/downvotes counts
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const postJson = post.toJSON();
      postJson.upvotesCount = await ForumPostUpvote.count({
        where: { postId: post.id },
      });
      postJson.downvotesCount = await ForumPostDownvote.count({
        where: { postId: post.id },
      });
      return postJson;
    })
  );

  res.json(postsWithCounts);
});

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'authorUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  if (post) {
    const postJson = post.toJSON();
    postJson.upvotesCount = await ForumPostUpvote.count({
      where: { postId: post.id },
    });
    postJson.downvotesCount = await ForumPostDownvote.count({
      where: { postId: post.id },
    });
    res.json(postJson);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a forum post
// @route   POST /api/forum
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;

  const post = await ForumPost.create({
    title,
    content,
    author: req.user.id,
    category,
    tags,
  });

  const populatedPost = await ForumPost.findByPk(post.id, {
    include: {
      model: User,
      as: 'authorUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  res.status(201).json(populatedPost);
});

// @desc    Update a forum post
// @route   PUT /api/forum/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    if (post.author !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.tags = req.body.tags || post.tags;

    const updatedPost = await post.save();
    const populatedPost = await ForumPost.findByPk(updatedPost.id, {
      include: {
        model: User,
        as: 'authorUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.json(populatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a forum post
// @route   DELETE /api/forum/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    if (post.author !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Comment.destroy({ where: { postId: post.id } });
    await ForumPostUpvote.destroy({ where: { postId: post.id } });
    await ForumPostDownvote.destroy({ where: { postId: post.id } });
    await ForumPostReport.destroy({ where: { postId: post.id } });
    await post.destroy();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Upvote a post
// @route   POST /api/forum/:id/upvote
// @access  Private
const upvotePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    const existingUpvote = await ForumPostUpvote.findOne({
      where: { postId: post.id, userId: req.user.id },
    });
    const existingDownvote = await ForumPostDownvote.findOne({
      where: { postId: post.id, userId: req.user.id },
    });

    if (existingUpvote) {
      await existingUpvote.destroy();
    } else {
      await ForumPostUpvote.create({
        postId: post.id,
        userId: req.user.id,
      });
      if (existingDownvote) {
        await existingDownvote.destroy();
      }
    }

    const upvotesCount = await ForumPostUpvote.count({
      where: { postId: post.id },
    });
    const downvotesCount = await ForumPostDownvote.count({
      where: { postId: post.id },
    });

    res.json({ upvotes: upvotesCount, downvotes: downvotesCount });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Downvote a post
// @route   POST /api/forum/:id/downvote
// @access  Private
const downvotePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    const existingDownvote = await ForumPostDownvote.findOne({
      where: { postId: post.id, userId: req.user.id },
    });
    const existingUpvote = await ForumPostUpvote.findOne({
      where: { postId: post.id, userId: req.user.id },
    });

    if (existingDownvote) {
      await existingDownvote.destroy();
    } else {
      await ForumPostDownvote.create({
        postId: post.id,
        userId: req.user.id,
      });
      if (existingUpvote) {
        await existingUpvote.destroy();
      }
    }

    const upvotesCount = await ForumPostUpvote.count({
      where: { postId: post.id },
    });
    const downvotesCount = await ForumPostDownvote.count({
      where: { postId: post.id },
    });

    res.json({ upvotes: upvotesCount, downvotes: downvotesCount });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Report a post
// @route   POST /api/forum/:id/report
// @access  Private
const reportPost = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    await ForumPostReport.create({
      postId: post.id, userId: req.user.id, reason });
    const reportsCount = await ForumPostReport.count({
      where: { postId: post.id },
    });

    if (reportsCount >= 3) {
      post.isReported = true;
      await post.save();
    }

    res.json({ isReported: post.isReported, reports: reportsCount });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get comments for a post
// @route   GET /api/forum/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
    include: [
      {
        model: User,
        as: 'authorUser',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: CommentReply,
        as: 'replies',
        include: [
          {
            model: User,
            as: 'authorUser',
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(comments);
});

// @desc    Add a comment
// @route   POST /api/forum/:postId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.create({
    content,
    author: req.user.id,
    postId: req.params.postId,
  });

  const populatedComment = await Comment.findByPk(comment.id, {
    include: {
      model: User,
      as: 'authorUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  res.status(201).json(populatedComment);
});

// @desc    Add a reply to a comment
// @route   POST /api/forum/:postId/comments/:commentId/replies
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findByPk(req.params.commentId);

  if (comment) {
    const reply = await CommentReply.create({
      content,
      author: req.user.id,
      commentId: comment.id,
    });

    const populatedReply = await CommentReply.findByPk(reply.id, {
      include: {
        model: User,
        as: 'authorUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.json(populatedReply);
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

// @desc    Get reported posts (Admin)
// @route   GET /api/forum/reported
// @access  Private/Admin
const getReportedPosts = asyncHandler(async (req, res) => {
  const posts = await ForumPost.findAll({
    where: { isReported: true },
    include: [
      {
        model: User,
        as: 'authorUser',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: ForumPostReport,
        as: 'reports',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ],
  });
  res.json(posts);
});

// @desc    Resolve reported post (Admin)
// @route   PUT /api/forum/:id/resolve
// @access  Private/Admin
const resolveReportedPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);

  if (post) {
    post.isReported = false;
    await ForumPostReport.destroy({ where: { postId: post.id } });
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  reportPost,
  getComments,
  addComment,
  addReply,
  getReportedPosts,
  resolveReportedPost,
};
