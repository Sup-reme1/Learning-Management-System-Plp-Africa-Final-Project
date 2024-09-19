const db = require('../config/db.config');
const path = require('path');

// Upload material for teachers
exports.uploadMaterial = (req, res) => {
    const { title, description } = req.body;
    const filePath = req.file.path; // Multer adds this to req object
    const teacherId = req.user.id; 

    const query = `INSERT INTO materials (title, description, file_path, uploaded_by) VALUES (?, ?, ?, ?)`;
    db.query(query, [title, description, filePath, teacherId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error uploading material', details: error})
        }
        res.status(201).json({ message: 'Material uploaded successfully', materialId: result.insertId});
    });
};

// Get list of materials for students
exports.getMaterials = (req, res) => {
    const query = `SELECT m.id, m.title, m.description, m.file_path, u.name as uploaded_by, m.uploaded_at
                    FROM materials m
                    JOIN users u ON m.uploaded_by = u.id`;
    db.query(query, (error, result) => {
        if (error){
            return res.status(500).json({ error: 'Error fetching material', details: error})
        }
        res.json(result);
    });
};

// Download material for students
exports.downloadMaterial = (req, res) => {
    const { id } = req.params;

    const query = `SELECT file_path FROM materials WHERE id = ?`;
    db.query(query, [id], (error, result) => {
        if (error){
            return res.status(500).json({ error: 'Error fetching material', details: error})
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Material not found' })
        }

        const filePath = result[0].file_path;
        // Serve the file for download
        res.download(path.join(__dirname, '..', filePath));
    });
;}