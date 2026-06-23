const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const NoteLike = require('../models/NoteLike');
const NoteRating = require('../models/NoteRating');
const User = require('../models/User');
const upload = require('../utils/upload');
const { Op } = require('sequelize');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
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

  const notes = await Note.findAll({
    where,
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  // Add likes count to each note
  const notesWithLikes = await Promise.all(
    notes.map(async (note) => {
      const noteJson = note.toJSON();
      const likesCount = await NoteLike.count({ where: { noteId: note.id } });
      noteJson.likesCount = likesCount;
      return noteJson;
    })
  );

  res.json(notesWithLikes);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });

  if (note) {
    const noteJson = note.toJSON();
    const likesCount = await NoteLike.count({ where: { noteId: note.id } });
    noteJson.likesCount = likesCount;
    res.json(noteJson);
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
      uploadedBy: req.user.id,
    });

    const populatedNote = await Note.findByPk(note.id, {
      include: {
        model: User,
        as: 'uploadedByUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.status(201).json(populatedNote);
  });
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findByPk(req.params.id);

  if (note) {
    if (note.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    note.title = req.body.title || note.title;
    note.description = req.body.description || note.description;
    note.department = req.body.department || note.department;
    note.semester = req.body.semester || note.semester;
    note.courseCode = req.body.courseCode || note.courseCode;

    const updatedNote = await note.save();
    const populatedNote = await Note.findByPk(updatedNote.id, {
      include: {
        model: User,
        as: 'uploadedByUser',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.json(populatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByPk(req.params.id);

  if (note) {
    if (note.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await note.destroy();
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
  const note = await Note.findByPk(req.params.id);

  if (note) {
    const existingLike = await NoteLike.findOne({
      where: { noteId: note.id, userId: req.user.id },
    });

    if (existingLike) {
      await existingLike.destroy();
    } else {
      await NoteLike.create({
        noteId: note.id,
        userId: req.user.id,
      });
    }

    const likesCount = await NoteLike.count({ where: { noteId: note.id } });
    res.json({ likes: likesCount });
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
  const note = await Note.findByPk(req.params.id);

  if (note) {
    const existingRating = await NoteRating.findOne({
      where: { noteId: note.id, userId: req.user.id },
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await NoteRating.create({
        noteId: note.id,
        userId: req.user.id,
        rating,
      });
    }

    // Calculate average rating
    const ratings = await NoteRating.findAll({ where: { noteId: note.id } });
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? total / ratings.length : 0;
    note.averageRating = averageRating;
    await note.save();

    res.json({ averageRating, ratings: ratings.length });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Increment download count
// @route   POST /api/notes/:id/download
// @access  Private
const incrementDownload = asyncHandler(async (req, res) => {
  const note = await Note.findByPk(req.params.id);

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
  const notes = await Note.findAll({
    where: { uploadedBy: req.user.id },
    include: {
      model: User,
      as: 'uploadedByUser',
      attributes: ['id', 'name', 'email'],
    },
  });
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
