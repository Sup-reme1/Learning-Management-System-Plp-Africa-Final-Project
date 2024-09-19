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

module.exports = { updateProgress };