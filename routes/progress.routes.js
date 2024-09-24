const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { updateProgress, getStudentProgress } = require('../controllers/progress.controller');

// Update progress (Students)
router.post('/', verifyToken, updateProgress);

// fetch students progress (teacher)
router.get('/', verifyToken, getStudentProgress)

module.exports = router;