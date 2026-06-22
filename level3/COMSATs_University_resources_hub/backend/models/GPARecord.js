const mongoose = require('mongoose');

const gpaRecordSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    courses: [
      {
        name: String,
        code: String,
        creditHours: Number,
        grade: String,
        gradePoint: Number,
      },
    ],
    sgpa: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GPARecord', gpaRecordSchema);
