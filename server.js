const express = require('express');
const authRoutes = require('./routes/auth.routes');
const materialRoutes = require('./routes/material.routes');
const userRoutes = require('./routes/user.routes');
const quizzesRoutes = require('./routes/quizzes.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const progressRoutes = require('./routes/progress.routes');
const discussionsRoutes = require('./routes/discussion.routes');
const { escape } = require('mysql2');
require('dotenv').config();

const path = require('path');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.use('/api/auth', authRoutes);   // Checked // connected
app.use('/api/materials', materialRoutes);  // Checked // connected
app.use('/api/users', userRoutes);  // Checked // connected
app.use('/api/quizzes', quizzesRoutes);  // Checked // connected Teachers, remaining students
app.use('/api/assignment', assignmentRoutes);  // Checked // connected
app.use('/api/progress', progressRoutes);  // Checked
// app.use('/api/discussions', discussionsRoutes);  // Yet to implement

// {
//   id: 4,
//   role: 'admin',
//   email: 'walee@gmail.com',
//   iat: 1727093045,
//   exp: 1727096645
// }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views', 'lms.home.html'));
  });


app.get('/student/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'students.dashboard.html'));
});
  
app.get('/teacher/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views', 'teachers.dashboard.html'));
  });
  
app.get('/user/profile', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views', 'users.profile.html'));
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
