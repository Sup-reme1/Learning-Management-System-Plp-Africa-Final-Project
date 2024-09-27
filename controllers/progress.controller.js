const db = require('../config/db.config');

const updateProgress = (req, res) => {
    const userId = req.user.id;
    const { materialId, status } = req.body;

    if (!materialId || !status) return res.status(400).json({ error: 'Material and status are required'});

    const query = `INSERT INTO progress (user_id, material_id, status) VALUES (?,?,?)`;
    db.query(query, [userId, materialId, status], (error, result) => {
        if (error) return res.status(500).json({ error: 'Database Error', details: error });

        return res.status(200).json({ message: 'Progress updated successfully' });
    });
};

const getStudentProgress = (req, res) => {
    const query = `SELECT 
                        u.id AS student_id,
                        u.first_name AS student_name,
                        COUNT(s.student_id) AS assignments_submitted,
                        IFNULL(GROUP_CONCAT(DISTINCT a.title SEPARATOR ', '), 'No submissions') AS assignment_names
                    FROM 
                        users u
                    LEFT JOIN
                        submissions s ON u.id = s.student_id
                    LEFT JOIN 
                        assignments a ON s.assignment_id = a.id
                    WHERE 
                        u.role = 'student'
                    GROUP BY 
                        u.id, u.first_name
    `
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Database Error', details: error });
        }

        return res.status(200).json({ message: 'Fetched Students Data Successfully', result: result });
    });
}
module.exports = { updateProgress, getStudentProgress };
// controllers/quizzes.controllers.js
