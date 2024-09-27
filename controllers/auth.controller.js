const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

exports.signup = (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
    
    try {
        // check email validity
        const query1 = `SELECT * FROM users WHERE email = ?`
        db.query(query1, [email], (error, result) => {
            if (result.length > 0) return res.status(409).json({message: 'User already exist'});

            // hashing the password with hashing techniques
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const query = `INSERT INTO users (first_name, last_name, email, role, password) VALUES (?,?,?,?,?)`;
            db.query(query, [first_name, last_name, email, role, hashedPassword], (error, result) => {
                if (error){
                    if (error.code === 'ER_DUP_ENTRY'){
                        return res.status(400).json({ error: 'Email already exists'});
                    }
                    return res.status(500).json({ error: 'Error creating user', details: error });
                }
                res.status(201).json({ message: 'User created successfully', userId: result.insertId});
            }); 
        })

    } catch (error) {
        res.status(500).json({'message': 'Something went wrong'});
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE email = ?`;

        db.query(query, [email], (error, result) => {
            if (error) throw error;
            
            if (result.length === 0){
                return res.status(404).json({error: 'User not found'});
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
                const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
                res.json({ message: 'Login successful', token });
                
            });
        });  
    } catch (error) {
        res.status(500).json({'message': 'Something went wrong'});
    }
};