const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  toggleBookmark,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkMongoConnection } = require('../middleware/dbMiddleware');

// Apply MongoDB connection check to all user routes
router.use(checkMongoConnection);

router.route('/').post(registerUser).get(protect, authorize('admin'), getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/bookmarks', protect, toggleBookmark);
router.route('/:id').delete(protect, authorize('admin'), deleteUser).get(protect, authorize('admin'), getUserById).put(protect, authorize('admin'), updateUser);

module.exports = router;
