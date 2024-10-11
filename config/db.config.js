const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) return console.log('Error connecting to Database', err.message);
    console.log('Connected to database successfully: ', db.threadId);

    db.query(`CREATE DATABASE IF NOT EXISTS lms_db`, (err, result) => {
        if (err) throw err;
        console.log('Database lms_db checked/created');

        // switch to the lms_db database
        db.changeUser({database: 'lms_db' }, (err) => {
            if (err) throw err;
            console.log('Swithced to lms_db database');
            
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;
            db.query(createUsersTable, (err,result) => {
                if (err) throw err;
                console.log('Users table checked/created');
                });
 
            const createMaterialsTable = `
                CREATE TABLE IF NOT EXISTS materials (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    file_path VARCHAR(255) NOT NULL,
                    uploaded_by INT,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
                )
            `;
            db.query(createMaterialsTable, (err,result) => {
                if (err) throw err;
                console.log('Materials table checked/created');
                });
                
            const createAssignmentTable = `
                CREATE TABLE IF NOT EXISTS assignments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    due_date DATE NOT NULL,
                    created_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                )
            `;
            db.query(createAssignmentTable, (err,result) => {
                if (err) throw err;
                console.log('Assignments table checked/created');
                });
                
            const createSubmissionTable = `
                CREATE TABLE IF NOT EXISTS submissions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    assignment_id INT,
                    student_id INT,
                    submission_file VARCHAR(255) NOT NULL,
                    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `;
            db.query(createSubmissionTable, (err,result) => {
                if (err) throw err;
                console.log('Submission table checked/created');
                });
                
            const createQuizzesTable = `
                CREATE TABLE IF NOT EXISTS quizzes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    created_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                )
            `;
            db.query(createQuizzesTable, (err,result) => {
                if (err) throw err;
                console.log('Quizzes table checked/created');
                });
      
            const createQuizQuestionTable = `
                CREATE TABLE IF NOT EXISTS quiz_questions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    quiz_id INT,
                    question_text TEXT NOT NULL,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
                )
            `;
            // question_type ENUM('multiple_choice', 'true_false', 'short_answer') NOT NULL,
            // correct_answer TEXT NOT NULL,
            db.query(createQuizQuestionTable, (err,result) => {
                if (err) throw err;
                console.log('Quiz Questions table checked/created');
                });
      
            const createProgressTable = `
                CREATE TABLE IF NOT EXISTS progress (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    material_id INT,   
                    status ENUM('completed', 'in-progress', 'not-started'),    
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
                )
            `;
            // course VARCHAR(100),
            // completed_assignments INT DEFAULT 0,
            // completed_quizzes INT DEFAULT 0,
            // total_score DECIMAL(5,2) DEFAULT 0.0,
            
            db.query(createProgressTable, (err,result) => {
                if (err) throw err;
                console.log('Progress table checked/created');
                });
        });
    })
});

module.exports = db;