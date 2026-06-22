const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema(
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
    videoUrl: String,
    videoFile: String,
    isYouTube: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
