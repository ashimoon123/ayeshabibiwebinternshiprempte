const asyncHandler = require('express-async-handler');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const upload = require('../utils/upload');
const { Op } = require('sequelize');

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Public
const getLectures = asyncHandler(async (req, res) => {
  const { department, semester, courseCode, search } = req.query;
  let where = {};

  if (department) where.department = department;
  if (semester) where.semester = semester;
  if (courseCode) where.courseCode = courseCode;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const lectures = await Lecture.findAll({
    where,
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });
  res.json(lectures);
});

// @desc    Get single lecture
// @route   GET /api/lectures/:id
// @access  Public
const getLectureById = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  if (lecture) {
    res.json(lecture);
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
});

// @desc    Upload a lecture
// @route   POST /api/lectures
// @access  Private
const uploadLecture = asyncHandler(async (req, res) => {
  const { title, description, department, semester, courseCode, videoUrl, isYouTube } = req.body;

  if (isYouTube === 'true' || isYouTube === true) {
    const lecture = await Lecture.create({
      title,
      description,
      department,
      semester,
      courseCode,
      videoUrl,
      isYouTube: true,
      uploadedBy: req.user.id,
    });

    const populatedLecture = await Lecture.findByPk(lecture.id, {
      include: {
        model: User,
        as: 'uploadedByUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.status(201).json(populatedLecture);
  } else {
    const uploadSingle = upload.single('videoFile');
    uploadSingle(req, res, async (err) => {
      if (err) {
        res.status(400);
        throw new Error(err);
      }

      const lecture = await Lecture.create({
        title,
        description,
        department,
        semester,
        courseCode,
        videoFile: req.file.filename,
        isYouTube: false,
        uploadedBy: req.user.id,
      });

      const populatedLecture = await Lecture.findByPk(lecture.id, {
        include: {
          model: User,
          as: 'uploadedByUser',
          attributes: ['id', 'name', 'email'],
        },
      });

      res.status(201).json(populatedLecture);
    });
  }
});

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
// @access  Private
const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByPk(req.params.id);

  if (lecture) {
    if (lecture.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    lecture.title = req.body.title || lecture.title;
    lecture.description = req.body.description || lecture.description;
    lecture.department = req.body.department || lecture.department;
    lecture.semester = req.body.semester || lecture.semester;
    lecture.courseCode = req.body.courseCode || lecture.courseCode;

    const updatedLecture = await lecture.save();
    const populatedLecture = await Lecture.findByPk(updatedLecture.id, {
      include: {
        model: User,
        as: 'uploadedByUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.json(populatedLecture);
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
});

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
// @access  Private
const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByPk(req.params.id);

  if (lecture) {
    if (lecture.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await lecture.destroy();
    res.json({ message: 'Lecture removed' });
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
});

// @desc    Increment view count
// @route   POST /api/lectures/:id/view
// @access  Private
const incrementView = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByPk(req.params.id);

  if (lecture) {
    lecture.views += 1;
    const updatedLecture = await lecture.save();
    res.json({ views: updatedLecture.views });
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
});

// @desc    Get user's uploads
// @route   GET /api/lectures/user
// @access  Private
const getUserLectures = asyncHandler(async (req, res) => {
  const lectures = await Lecture.findAll({
    where: { uploadedBy: req.user.id },
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });
  res.json(lectures);
});

module.exports = {
  getLectures,
  getLectureById,
  uploadLecture,
  updateLecture,
  deleteLecture,
  incrementView,
  getUserLectures,
};
