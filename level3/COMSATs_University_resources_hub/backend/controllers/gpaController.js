const asyncHandler = require('express-async-handler');
const GPARecord = require('../models/GPARecord');

// Grade to grade point conversion
const gradePoints = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

// @desc    Calculate GPA
// @route   POST /api/gpa/calculate
// @access  Private
const calculateGPA = asyncHandler(async (req, res) => {
  const { courses } = req.body;

  let totalGradePoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const gradePoint = gradePoints[course.grade];
    if (gradePoint !== undefined) {
      course.gradePoint = gradePoint;
      totalGradePoints += gradePoint * course.creditHours;
      totalCredits += course.creditHours;
    }
  });

  const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  res.json({
    courses,
    sgpa,
    totalCredits,
  });
});

// @desc    Save GPA record
// @route   POST /api/gpa
// @access  Private
const saveGPARecord = asyncHandler(async (req, res) => {
  const { semester, courses, sgpa } = req.body;

  // Get all previous records to calculate CGPA
  const previousRecords = await GPARecord.find({ user: req.user._id }).sort({ semester: 1 });
  
  let totalGradePoints = sgpa * courses.reduce((sum, c) => sum + c.creditHours, 0);
  let totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);

  previousRecords.forEach(record => {
    const recordCredits = record.courses.reduce((sum, c) => sum + c.creditHours, 0);
    totalGradePoints += record.sgpa * recordCredits;
    totalCredits += recordCredits;
  });

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : sgpa;

  const gpaRecord = await GPARecord.create({
    user: req.user._id,
    semester,
    courses,
    sgpa,
    cgpa,
  });

  res.status(201).json(gpaRecord);
});

// @desc    Get user's GPA records
// @route   GET /api/gpa
// @access  Private
const getGPARecords = asyncHandler(async (req, res) => {
  const records = await GPARecord.find({ user: req.user._id }).sort({ semester: 1 });
  res.json(records);
});

// @desc    Delete GPA record
// @route   DELETE /api/gpa/:id
// @access  Private
const deleteGPARecord = asyncHandler(async (req, res) => {
  const record = await GPARecord.findById(req.params.id);

  if (record) {
    if (record.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await GPARecord.deleteOne({ _id: req.params.id });
    res.json({ message: 'GPA record removed' });
  } else {
    res.status(404);
    throw new Error('GPA record not found');
  }
});

// @desc    Get grade conversion table
// @route   GET /api/gpa/conversion
// @access  Public
const getGradeConversion = asyncHandler(async (req, res) => {
  res.json(gradePoints);
});

module.exports = {
  calculateGPA,
  saveGPARecord,
  getGPARecords,
  deleteGPARecord,
  getGradeConversion,
};
