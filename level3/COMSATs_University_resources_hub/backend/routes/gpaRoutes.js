const express = require('express');
const router = express.Router();
const {
  calculateGPA,
  saveGPARecord,
  getGPARecords,
  deleteGPARecord,
  getGradeConversion,
} = require('../controllers/gpaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, saveGPARecord).get(protect, getGPARecords);
router.post('/calculate', protect, calculateGPA);
router.get('/conversion', getGradeConversion);
router.route('/:id').delete(protect, deleteGPARecord);

module.exports = router;
