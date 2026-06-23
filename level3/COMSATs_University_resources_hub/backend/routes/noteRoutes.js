const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  uploadNote,
  updateNote,
  deleteNote,
  likeNote,
  rateNote,
  incrementDownload,
  getUserNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getNotes).post(protect, uploadNote);
router.route('/user').get(protect, getUserNotes);
router.route('/:id').get(getNoteById).put(protect, updateNote).delete(protect, deleteNote);
router.route('/:id/like').post(protect, likeNote);
router.route('/:id/rate').post(protect, rateNote);
router.route('/:id/download').post(protect, incrementDownload);

module.exports = router;
