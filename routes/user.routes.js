const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Get user profile info
router.get('/profile', verifyToken, getUserProfile);

// Update user profile info
router.post('/profile', verifyToken, upload.single('profileImg'), updateUserProfile);

// router.post('/profile', verifyToken, async (req,res));

module.exports = router;