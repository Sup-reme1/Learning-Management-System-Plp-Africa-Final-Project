const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { updateProgress } = require('../controllers/progress.controller');

// Update progress (Students)
router.post('/', verifyToken, updateProgress);

module.exports = router;