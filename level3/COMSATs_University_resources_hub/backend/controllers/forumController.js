const asyncHandler = require('express-async-handler');
const { ForumPost, Comment } = require('../models/ForumPost');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = { isReported: false };

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const posts = await ForumPost.find(query).populate('author', 'name email').sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id).populate('author', 'name email');

  if (post) {
    res.json(post);
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
    author: req.user._id,
    category,
    tags,
  });

  const populatedPost = await ForumPost.findById(post._id).populate('author', 'name email');
  res.status(201).json(populatedPost);
});

// @desc    Update a forum post
// @route   PUT /api/forum/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.tags = req.body.tags || post.tags;

    const updatedPost = await post.save().then(p => p.populate('author', 'name email'));
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a forum post
// @route   DELETE /api/forum/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Comment.deleteMany({ post: post._id });
    await ForumPost.deleteOne({ _id: req.params.id });
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
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    const alreadyUpvoted = post.upvotes.find(
      (vote) => vote.toString() === req.user._id.toString()
    );
    const alreadyDownvoted = post.downvotes.find(
      (vote) => vote.toString() === req.user._id.toString()
    );

    if (alreadyUpvoted) {
      post.upvotes = post.upvotes.filter(
        (vote) => vote.toString() !== req.user._id.toString()
      );
    } else {
      post.upvotes.push(req.user._id);
      if (alreadyDownvoted) {
        post.downvotes = post.downvotes.filter(
          (vote) => vote.toString() !== req.user._id.toString()
        );
      }
    }

    const updatedPost = await post.save();
    res.json({ upvotes: updatedPost.upvotes, downvotes: updatedPost.downvotes });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Downvote a post
// @route   POST /api/forum/:id/downvote
// @access  Private
const downvotePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    const alreadyDownvoted = post.downvotes.find(
      (vote) => vote.toString() === req.user._id.toString()
    );
    const alreadyUpvoted = post.upvotes.find(
      (vote) => vote.toString() === req.user._id.toString()
    );

    if (alreadyDownvoted) {
      post.downvotes = post.downvotes.filter(
        (vote) => vote.toString() !== req.user._id.toString()
      );
    } else {
      post.downvotes.push(req.user._id);
      if (alreadyUpvoted) {
        post.upvotes = post.upvotes.filter(
          (vote) => vote.toString() !== req.user._id.toString()
        );
      }
    }

    const updatedPost = await post.save();
    res.json({ upvotes: updatedPost.upvotes, downvotes: updatedPost.downvotes });
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
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    post.reports.push({ user: req.user._id, reason });
    if (post.reports.length >= 3) {
      post.isReported = true;
    }

    const updatedPost = await post.save();
    res.json({ isReported: updatedPost.isReported, reports: updatedPost.reports });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get comments for a post
// @route   GET /api/forum/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name email')
    .populate('replies.author', 'name email')
    .sort({ createdAt: -1 });
  res.json(comments);
});

// @desc    Add a comment
// @route   POST /api/forum/:postId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: req.params.postId,
  });

  const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');
  res.status(201).json(populatedComment);
});

// @desc    Add a reply to a comment
// @route   POST /api/forum/:postId/comments/:commentId/replies
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.commentId);

  if (comment) {
    comment.replies.push({
      content,
      author: req.user._id,
    });

    const updatedComment = await comment.save()
      .then(c => c.populate('author', 'name email'))
      .then(c => c.populate('replies.author', 'name email'));
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

// @desc    Get reported posts (Admin)
// @route   GET /api/forum/reported
// @access  Private/Admin
const getReportedPosts = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find({ isReported: true })
    .populate('author', 'name email')
    .populate('reports.user', 'name email');
  res.json(posts);
});

// @desc    Resolve reported post (Admin)
// @route   PUT /api/forum/:id/resolve
// @access  Private/Admin
const resolveReportedPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);

  if (post) {
    post.isReported = false;
    post.reports = [];

    const updatedPost = await post.save();
    res.json(updatedPost);
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
