const asyncHandler = require('express-async-handler');
const PastPaper = require('../models/PastPaper');
const upload = require('../utils/upload');

// @desc    Get all approved past papers
// @route   GET /api/pastpapers
// @access  Public
const getPastPapers = asyncHandler(async (req, res) => {
  const { subject, semester, year, search } = req.query;
  let query = { isApproved: true };

  if (subject) query.subject = subject;
  if (semester) query.semester = semester;
  if (year) query.year = year;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pastPapers = await PastPaper.find(query).populate('uploadedBy', 'name email');
  res.json(pastPapers);
});

// @desc    Get single past paper
// @route   GET /api/pastpapers/:id
// @access  Public
const getPastPaperById = asyncHandler(async (req, res) => {
  const pastPaper = await PastPaper.findById(req.params.id).populate('uploadedBy', 'name email');

  if (pastPaper) {
    if (!pastPaper.isApproved && req.user?.role !== 'admin' && req.user?.role !== 'moderator') {
      res.status(403);
      throw new Error('Not authorized');
    }
    res.json(pastPaper);
  } else {
    res.status(404);
    throw new Error('Past paper not found');
  }
});

// @desc    Upload a past paper
// @route   POST /api/pastpapers
// @access  Private
const uploadPastPaper = asyncHandler(async (req, res) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err);
    }

    const { title, description, subject, semester, year } = req.body;

    const pastPaper = await PastPaper.create({
      title,
      description,
      subject,
      semester,
      year,
      file: req.file.filename,
      uploadedBy: req.user._id,
      isApproved: req.user.role === 'admin' || req.user.role === 'moderator',
    });

    res.status(201).json(pastPaper);
  });
});

// @desc    Update a past paper
// @route   PUT /api/pastpapers/:id
// @access  Private
const updatePastPaper = asyncHandler(async (req, res) => {
  const pastPaper = await PastPaper.findById(req.params.id);

  if (pastPaper) {
    if (pastPaper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    pastPaper.title = req.body.title || pastPaper.title;
    pastPaper.description = req.body.description || pastPaper.description;
    pastPaper.subject = req.body.subject || pastPaper.subject;
    pastPaper.semester = req.body.semester || pastPaper.semester;
    pastPaper.year = req.body.year || pastPaper.year;

    const updatedPastPaper = await pastPaper.save();
    res.json(updatedPastPaper);
  } else {
    res.status(404);
    throw new Error('Past paper not found');
  }
});

// @desc    Delete a past paper
// @route   DELETE /api/pastpapers/:id
// @access  Private
const deletePastPaper = asyncHandler(async (req, res) => {
  const pastPaper = await PastPaper.findById(req.params.id);

  if (pastPaper) {
    if (pastPaper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    await PastPaper.deleteOne({ _id: req.params.id });
    res.json({ message: 'Past paper removed' });
  } else {
    res.status(404);
    throw new Error('Past paper not found');
  }
});

// @desc    Approve a past paper (Admin/Moderator)
// @route   PUT /api/pastpapers/:id/approve
// @access  Private/Admin/Moderator
const approvePastPaper = asyncHandler(async (req, res) => {
  const pastPaper = await PastPaper.findById(req.params.id);

  if (pastPaper) {
    pastPaper.isApproved = true;
    pastPaper.approvedBy = req.user._id;

    const updatedPastPaper = await pastPaper.save();
    res.json(updatedPastPaper);
  } else {
    res.status(404);
    throw new Error('Past paper not found');
  }
});

// @desc    Get pending past papers (Admin/Moderator)
// @route   GET /api/pastpapers/pending
// @access  Private/Admin/Moderator
const getPendingPastPapers = asyncHandler(async (req, res) => {
  const pastPapers = await PastPaper.find({ isApproved: false }).populate('uploadedBy', 'name email');
  res.json(pastPapers);
});

// @desc    Increment download count
// @route   POST /api/pastpapers/:id/download
// @access  Private
const incrementDownload = asyncHandler(async (req, res) => {
  const pastPaper = await PastPaper.findById(req.params.id);

  if (pastPaper) {
    pastPaper.downloadCount += 1;
    const updatedPastPaper = await pastPaper.save();
    res.json({ downloadCount: updatedPastPaper.downloadCount });
  } else {
    res.status(404);
    throw new Error('Past paper not found');
  }
});

// @desc    Get user's uploads
// @route   GET /api/pastpapers/user
// @access  Private
const getUserPastPapers = asyncHandler(async (req, res) => {
  const pastPapers = await PastPaper.find({ uploadedBy: req.user._id });
  res.json(pastPapers);
});

module.exports = {
  getPastPapers,
  getPastPaperById,
  uploadPastPaper,
  updatePastPaper,
  deletePastPaper,
  approvePastPaper,
  getPendingPastPapers,
  incrementDownload,
  getUserPastPapers,
};
