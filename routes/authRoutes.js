const express = require('express');
const { register, login, getusername} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Private
router.post('/login', login); 

router.post('/username', getusername)

module.exports = router;
