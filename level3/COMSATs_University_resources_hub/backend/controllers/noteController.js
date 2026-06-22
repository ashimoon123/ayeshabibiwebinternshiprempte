const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const upload = require('../utils/upload');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
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

  const notes = await Note.find(query).populate('uploadedBy', 'name email');
  res.json(notes);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email');

  if (note) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Upload a note
// @route   POST /api/notes
// @access  Private
const uploadNote = asyncHandler(async (req, res) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err);
    }

    const { title, description, department, semester, courseCode } = req.body;

    const note = await Note.create({
      title,
      description,
      department,
      semester,
      courseCode,
      file: req.file.filename,
      uploadedBy: req.user._id,
    });

    res.status(201).json(note);
  });
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    note.title = req.body.title || note.title;
    note.description = req.body.description || note.description;
    note.department = req.body.department || note.department;
    note.semester = req.body.semester || note.semester;
    note.courseCode = req.body.courseCode || note.courseCode;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Like a note
// @route   POST /api/notes/:id/like
// @access  Private
const likeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    const alreadyLiked = note.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      note.likes = note.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      note.likes.push(req.user._id);
    }

    const updatedNote = await note.save();
    res.json({ likes: updatedNote.likes });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Rate a note
// @route   POST /api/notes/:id/rate
// @access  Private
const rateNote = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const note = await Note.findById(req.params.id);

  if (note) {
    const existingRating = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      note.ratings.push({ user: req.user._id, rating });
    }

    // Calculate average rating
    const total = note.ratings.reduce((sum, r) => sum + r.rating, 0);
    note.averageRating = total / note.ratings.length;

    const updatedNote = await note.save();
    res.json({ averageRating: updatedNote.averageRating, ratings: updatedNote.ratings });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Increment download count
// @route   POST /api/notes/:id/download
// @access  Private
const incrementDownload = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    note.downloadCount += 1;
    const updatedNote = await note.save();
    res.json({ downloadCount: updatedNote.downloadCount });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Get user's uploads
// @route   GET /api/notes/user
// @access  Private
const getUserNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ uploadedBy: req.user._id });
  res.json(notes);
});

module.exports = {
  getNotes,
  getNoteById,
  uploadNote,
  updateNote,
  deleteNote,
  likeNote,
  rateNote,
  incrementDownload,
  getUserNotes,
};
