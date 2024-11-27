const multer = require('multer');
const path = require('path');

// Set storage engine for Multer
const storage = multer.diskStorage({
  // Define where the files should be saved
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Make sure this folder exists or create it manually
  },
  // Define the filename format
  filename: (req, file, cb) => {
    // Create a unique filename using current timestamp and original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to restrict the types of files that can be uploaded
const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|txt/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, GIF, PDF, and TXT are allowed.'));
  }
};

// Set up Multer with the storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5MB here)
  fileFilter: fileFilter
});

module.exports = upload;
