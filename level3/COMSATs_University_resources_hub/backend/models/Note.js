const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
