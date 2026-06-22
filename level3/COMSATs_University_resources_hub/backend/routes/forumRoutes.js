const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/reported').get(protect, authorize('admin'), getReportedPosts);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/upvote').post(protect, upvotePost);
router.route('/:id/downvote').post(protect, downvotePost);
router.route('/:id/report').post(protect, reportPost);
router.route('/:id/resolve').put(protect, authorize('admin'), resolveReportedPost);
router.route('/:postId/comments').get(getComments).post(protect, addComment);
router.route('/:postId/comments/:commentId/replies').post(protect, addReply);

module.exports = router;
