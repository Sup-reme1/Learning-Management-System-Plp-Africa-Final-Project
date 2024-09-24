const express = require('express');
const { uploadMaterial, getMaterials, downloadMaterial } = require('../controllers/materials.controller');
const upload = require('../middlewares/upload.middleware');
const { verifyToken } = require('../middlewares/auth.middleware'); // Assume this check jwt token
const router = express.Router();
const multer = require('multer');

// Upload a material (Teacher only, to protect with verifyToken middleware)
// Teachers checked blocked student from uploading successful
router.post('/upload', verifyToken, upload.single('file'), uploadMaterial);

// Get all materials (accessible to everyone)
// Everyone checked
router.get('/', getMaterials)

// Download material by ID
// Teachers checked and students successfully
router.get('/:id/download', downloadMaterial);



module.exports = router;

