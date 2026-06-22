const express = require('express');
const router = express.Router();
const {
  getLectures,
  getLectureById,
  uploadLecture,
  updateLecture,
  deleteLecture,
  incrementView,
  getUserLectures,
} = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getLectures).post(protect, uploadLecture);
router.route('/user').get(protect, getUserLectures);
router.route('/:id').get(getLectureById).put(protect, updateLecture).delete(protect, deleteLecture);
router.route('/:id/view').post(protect, incrementView);

module.exports = router;
