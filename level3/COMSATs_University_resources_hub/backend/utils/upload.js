const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
const checkFileType = (file, cb) => {
  // Allowed file extensions
  const filetypes = /pdf|doc|docx|ppt|pptx|mp4|avi|mov/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Documents and Videos only!');
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;
