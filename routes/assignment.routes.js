const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const { createAssignment, getAssignments, submitAssignment, removeAssignment } = require('../controllers/assignments.controller');

// Create assignment (Teachers only)
router.post('/', verifyToken, createAssignment);

// Get all assignments (Students and Teachers)
router.get('/', verifyToken, getAssignments);

// Remove assignments for Teachers
router.delete('/', verifyToken, removeAssignment);

// Submit assignment (Students only)
router.post('/:id/submit', verifyToken, upload.single('file'), submitAssignment);

module.exports = router;
