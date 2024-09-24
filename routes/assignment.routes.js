const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const { createAssignment, getAssignments, submitAssignment } = require('../controllers/assignments.controller');

// Create assignment (Teachers only)
// Completed 70% remaining questions path
router.post('/', verifyToken, createAssignment);

// Get all assignments (Students and Teachers)
// Completed 70% remaining questions path
router.get('/', verifyToken, getAssignments);

// Submit assignment (Students only)
router.post('/:id/submit', verifyToken, upload.single('file'), submitAssignment);

module.exports = router;
