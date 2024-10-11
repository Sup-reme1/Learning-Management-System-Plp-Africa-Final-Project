const db = require('../config/db.config');

exports.getUserProfile = (req, res) => {
    const userId = req.user.id;

    try {
        const query = `SELECT id, first_name, last_name, role, address, contact, gender, age, profile_image_path FROM users WHERE id = ?`;
        db.query(query, [userId], (error, result) => {
            if (error) return res.status(500).json({ error: 'Database error'});

            if (result.length === 0) return res.status(404).json({ error: 'User not found'});

            res.status(200).json(result[0]);
        }); 
    } catch (error) {
        res.status(500).json({'message': 'Something went wrong'});
    }
    

};

exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const profileImg = req.profileImg.path;
    const { first_name, last_name, role, address, contact, gender, age } = req.body;

    console.log(profileImg);

    try {
        const query = `UPDATE users SET first_name = ?, last_name = ?, role = ?, address = ?, profile_image_path = ?, contact = ?, gender = ?, age =? WHERE id = ?`;
        db.query(query, [first_name, last_name, role, address, profileImg, contact, gender, age, userId], (error, result) => {
            console.log('error:', error);
            console.log('result:', result);
            if (error) return res.status(500).json({ error: 'Database error', details: error});

            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found'});

            res.status(200).json({ message: 'Profile updated successfully' });
        });
    } catch (error) {
        res.status(500).json({'message': 'Something went wrong'});
    }

};
