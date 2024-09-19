const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { createQuiz, getQuizzes } = require('../controllers/quizzes.controllers');

// Create quiz (Teachers only)
router.post('/', verifyToken, createQuiz);

// Get all quizzes (Students and Teachers)
router.get('/', verifyToken, getQuizzes);

module.exports = router;