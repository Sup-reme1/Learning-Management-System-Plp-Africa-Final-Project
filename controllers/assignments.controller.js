const db = require('../config/db.config');
const { verifyToken } = require('../middlewares/auth.middleware');

// Create assignment for teachers
const createAssignment = (req, res) => {
    const { title, description, dueDate } = req.body;
    const teacherId = req.user.id;

    if (req.user.role === 'student'){
        return res.status(403).json({ error: 'Not Authorized' });
    }


    if (!title || !description || !dueDate){
        return res.status(400).json({ error: 'Title, description, and due date are required'});
    }

    const query = `INSERT INTO assignments (title, description, due_date, created_by) 
                    VALUES (?,?,?,?)`;
    db.query(query, [title, description, dueDate, teacherId], (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        res.status(200).json({ message: 'Assignment created successfully', assignmentId: result.insertId });
    });
};


// Delete assignment for teachers
const removeAssignment = (req, res) => {
    const { id } = req.body;

    if (req.user.role === 'student' || req.user.role === 'admin'){
        return res.status(403).json({ error: 'Not Authorized' });
    }

    const query = `DELETE FROM assignments WHERE id = ?`;
    db.query(query, [id], (error, result) => {
        if (error){
            return res.status(500).json({ error: 'Error deleting assignment', details: error})
        }
        res.status(200).json({ message: "Assignment removed successfully", details: result});
    });
}

// Get  assignment for teachers and Students
const getAssignments = (req, res) => {
    const query = `SELECT * FROM assignments`;

    db.query(query, (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        res.status(200).json(result);
    });    
};

// Submit assignment for students
const submitAssignment = (req, res) => {
    const assignmentId = req.params.id;
    const studentId = req.user.id;
    const filePath = req.file.path; // Multer adds this to req object

    if (req.user.role === 'teacher' || req.user.role === 'admin'){
        return res.status(403).json({ error: 'Not Authorized' });
    }

    const query = `INSERT INTO submissions (assignment_id, student_id, submission_file)
                    VALUES (?, ?, ?)`;
    db.query(query, [assignmentId, studentId, filePath], (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        res.status(200).json({ message: 'Assignment submitted successfully' });
    });
};

module.exports = { createAssignment, getAssignments, submitAssignment, removeAssignment };