const express = require('express');
const multer = require('../middlewares/multerConfig');
const { uploadFile,getAllFiles,getSharedFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/files/upload
// @desc    Upload a file with tags
// @access  Private
router.post('/upload', authMiddleware, multer.single('file'), uploadFile);

// @route   GET /api/files/share/:id
// @desc    Generate a shareable link for a file
// @access  Private
// router.get('/share/:id', authMiddleware, shareFile);
router.get('/share/:id', getSharedFile);

// @route   GET /api/files/getfiles
// @desc    Generate a shareable link for a file
// @access  Private
router.post('/getfiles', authMiddleware, getAllFiles);

module.exports = router;
