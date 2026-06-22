const asyncHandler = require('express-async-handler');
const Lecture = require('../models/Lecture');
const upload = require('../utils/upload');

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Public
const getLectures = asyncHandler(async (req, res) => {
  const { department, semester, courseCode, search } = req.query;
  let query = {};

  if (department) query.department = department;
  if (semester) query.semester = semester;
  if (courseCode) query.courseCode = courseCode;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const lectures = await Lecture.find(query).populate('uploadedBy', 'name email');
  res.json(lectures);
});

// @desc    Get single lecture
// @route   GET /api/lectures/:id
// @access  Public
const getLectureById = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id).populate('uploadedBy', 'name email');

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
  
  if (isYouTube) {
    const lecture = await Lecture.create({
      title,
      description,
      department,
      semester,
      courseCode,
      videoUrl,
      isYouTube: true,
      uploadedBy: req.user._id,
    });

    res.status(201).json(lecture);
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
        uploadedBy: req.user._id,
      });

      res.status(201).json(lecture);
    });
  }
});

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
// @access  Private
const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (lecture) {
    if (lecture.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    lecture.title = req.body.title || lecture.title;
    lecture.description = req.body.description || lecture.description;
    lecture.department = req.body.department || lecture.department;
    lecture.semester = req.body.semester || lecture.semester;
    lecture.courseCode = req.body.courseCode || lecture.courseCode;

    const updatedLecture = await lecture.save();
    res.json(updatedLecture);
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
});

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
// @access  Private
const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (lecture) {
    if (lecture.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Lecture.deleteOne({ _id: req.params.id });
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
  const lecture = await Lecture.findById(req.params.id);

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
  const lectures = await Lecture.find({ uploadedBy: req.user._id });
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
