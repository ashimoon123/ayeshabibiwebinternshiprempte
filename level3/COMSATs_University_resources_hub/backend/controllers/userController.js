const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user && (await user.matchPassword(password))) {
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.json({
      ...userWithoutPassword,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, semester } = req.body;

  console.log('📝 Registering user:', { name, email, role, department, semester });

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    semester,
  });

  if (user) {
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(201).json({
      ...userWithoutPassword,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.semester = req.body.semester || user.semester;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const userWithoutPassword = updatedUser.toJSON();
    delete userWithoutPassword.password;

    res.json({
      ...userWithoutPassword,
      token: generateToken(updatedUser.id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle bookmark
// @route   POST /api/users/bookmarks
// @access  Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const { resourceId, resourceType } = req.body;
  const userId = req.user.id;

  // Check if bookmark exists
  const existingBookmark = await Bookmark.findOne({
    where: { userId, resourceId, resourceType },
  });

  if (existingBookmark) {
    // Remove bookmark
    await existingBookmark.destroy();
  } else {
    // Add bookmark
    await Bookmark.create({
      userId,
      resourceId,
      resourceType,
    });
  }

  // Return all bookmarks for user
  const bookmarks = await Bookmark.findAll({
    where: { userId },
  });

  res.json({ bookmarks });
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
  res.json(users);
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    await user.destroy();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.department = req.body.department || user.department;
    user.semester = req.body.semester || user.semester;

    const updatedUser = await user.save();
    const userWithoutPassword = updatedUser.toJSON();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  toggleBookmark,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
