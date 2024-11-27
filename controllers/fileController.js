const File = require('../models/File');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// @desc    Upload a file with tags
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    // Get user info and file info
    const userId = req.user.id;  // Assuming user info is stored in req.user after authentication
    const file = req.file;       // file uploaded via multer

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { tags } = req.body;
    
    // Create a new File record in the database 
    const newFile = new File({
      uploadedBy: userId,  // Store the userId (uploadedBy) from the token
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      tags: tags ? tags.split(',') : [],  // Split comma-separated tags
    });

    // Save the file details to the database
    await newFile.save();

    // Return the file details as a response
    res.status(200).json({
      message: 'File uploaded successfully',
      file: newFile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Share a file by generating a link
// @route   GET /api/files/share/:id
// @access  Private
exports.shareFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    // Find the file by ID
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Generate a unique link for sharing
    const shareLink = `${process.env.BASE_URL}/api/files/${file._id}`;

    res.status(200).json({
      message: 'File shared successfully',
      shareLink
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

 

// @desc    Get shared file by ID and increment view count
// @route   GET /api/files/share/:id
// @access  Public
exports.getSharedFile = async (req, res) => {
  try {
    const fileId = req.params.id; // File ID from URL params

    // Find the file by ID
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increment the view count
    file.views += 1;
    await file.save();

    // Return the file details
    res.status(200).json({
      message: 'File retrieved successfully',
      fileUrl: `${process.env.BASE_URL}/${file.path}`,
      views: file.views,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get all files for a user (optional)
// @route   GET /api/files
// @access  Private
exports.getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    console.log(userId)
    // Retrieve all files uploaded by the user
    const files = await File.find({ uploadedBy: userId });

    res.status(200).json({
      message: 'Files retrieved successfully',
      files
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
