const db = require('../config/db.config');
const { array } = require('../middlewares/upload.middleware');

const createQuiz = (req, res) => {
    const { title, questions } = req.body;
    const teacherId = req.user.id;
    console.log(req.body);

    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Title, description, and due date are required'});
    }

    // Save quiz details and create id for questions
    const query = `INSERT INTO quizzes (title, created_by) VALUES (?, ?)`;
    db.query(query, [title, teacherId], (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        const quizId = result.insertId;

        // Save questions one by one
        const questionQueries = questions.map(question => {
            db.query('INSERT INTO quiz_questions (quiz_id, question_text) VALUES (?,?)', [quizId, question])
        });

        Promise.all(questionQueries).then(() => {
            res.status(201).json({ message: 'Quiz created successfully', quizId});
        }).catch(error => {
            res.status(500).json({ error: 'Database error', error});
        });
    });
};

const getQuizzes = (req, res) => {
    const query = `SELECT * FROM quizzes`;
    
    // SQL Syntax to retive all questions
    // const query = `SELECT q.id AS quiz_id, q.title, qq.id AS question_id, qq.question_text
    //             FROM quizzes q
    //             JOIN quiz_questions qq ON q.id = qq.quiz_id;`;
    

    db.query(query, (error, result) => {
        if (error) return res.status(500).json({ error: 'Database error', details: error});

        res.status(200).json(result);
    });
};

module.exports = { createQuiz, getQuizzes }

// SQL Syntax to retive all questions
// SELECT q.id AS quiz_id, q.title, qq.id AS question_id, qq.question_text
// FROM quizzes q
// JOIN quiz_questions qq ON q.id = qq.quiz_id;

// RESULTS
// {
//     "message": "Quizzes retrieved successfully",
//     "quizzes": [
//       {
//         "quiz_id": 1,
//         "title": "Math Quiz",
//         "question_id": 1,
//         "question_text": "What is 2 + 2?"
//       },
//       {
//         "quiz_id": 1,
//         "title": "Math Quiz",
//         "question_id": 2,
//         "question_text": "What is 5 - 3?"
//       },
//       {
//         "quiz_id": 2,
//         "title": "Science Quiz",
//         "question_id": 3,
//         "question_text": "What is the boiling point of water?"
//       }
//     ]
//   }



// ===============================================
// // Assuming this is inside an async function
// try {
//     // Save quiz questions
//     for (const question of questions) {
//       await db.query(
//         'INSERT INTO quiz_questions (quiz_id, question_text) VALUES (?, ?)', 
//         [quizId, question]
//       );
//     }
    
//     // Once all questions are saved, send a success response
//     res.status(201).json({ message: 'Quiz created successfully', quizId });
  
//   } catch (err) {
//     // Handle any error that occurs during the process
//     res.status(500).json({ error: 'Database error', details: err.message });
//   }