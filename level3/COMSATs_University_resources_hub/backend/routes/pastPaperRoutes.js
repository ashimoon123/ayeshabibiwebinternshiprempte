const express = require('express');
const router = express.Router();
const {
  getPastPapers,
  getPastPaperById,
  uploadPastPaper,
  updatePastPaper,
  deletePastPaper,
  approvePastPaper,
  getPendingPastPapers,
  incrementDownload,
  getUserPastPapers,
} = require('../controllers/pastPaperController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getPastPapers).post(protect, uploadPastPaper);
router.route('/user').get(protect, getUserPastPapers);
router.route('/pending').get(protect, authorize('admin', 'moderator'), getPendingPastPapers);
router.route('/:id').get(protect, getPastPaperById).put(protect, updatePastPaper).delete(protect, deletePastPaper);
router.route('/:id/approve').put(protect, authorize('admin', 'moderator'), approvePastPaper);
router.route('/:id/download').post(protect, incrementDownload);

module.exports = router;
