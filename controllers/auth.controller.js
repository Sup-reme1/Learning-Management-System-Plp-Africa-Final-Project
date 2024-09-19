const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

exports.signup = (req, res) => {
    const { name, email, password, role } = req.body;

    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) res.status(500).json({ error: 'Error hashing password', details: err });

        const query = `INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)`;
        db.query(query, [name, email, hashedPassword, role], (error, result) => {
            if (error){
                if (error.code === 'ER_DUP_ENTRY'){
                    return res.status(400).json({ error: 'Email already exists'});
                }
                return res.status(500).json({ error: 'Error creating user', details: error });
            }

            res.status(201).json({ message: 'User created successfully', userId: result.insertId});
        }); 
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], (error, result) => {
        if (error){
            res.status(500).json({error: 'Error fetching user', details: error});
        }
        if (result.length === 0){
            res.status(200).json({error: 'User not found'});
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error){
                res.status(500).json({error: 'Error comparing password', details: error});
            }

            if (!isMatch){
                res.status(401).json({ error: 'Invalid password' });
            }
            
            // Generate JWT Token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.json({ message: 'Login successful', token });
        });
    });        
};