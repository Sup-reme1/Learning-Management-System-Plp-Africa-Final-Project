const db = require('../config/db.config');

exports.getUserProfile = (req, res) => {
    const userId = req.user.id;
    
    const query = `SELECT id, name, role FROM users WHERE id = ?`;
    db.query(query, [userId], (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error'});

        if (result.length === 0) return res.status(404).json({ error: 'User not found'});

        res.status(200).json(result[0]);
    });
};

exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const { name, role, address, contact, gender, age } = req.body;
    // update sql syntax to accomodate the following
    // { address, contact, gender, age }
    // { name, role, address, contact, gender, age }

    if (!name || !role){
        return res.status(400).json({ error: 'Username and role are required'});
    }

    const query = `UPDATE users SET name = ?, role = ?, address = ?, contact = ?, gender = ?, age =? WHERE id = ?`;
    db.query(query, [name, role, address, contact, gender, age, userId], (error, result) => {
        console.log('error:', error);
        console.log('result:', result);
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found'});

        res.status(200).json({ message: 'Profile updated successfully' });
    });
};
