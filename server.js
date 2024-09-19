const express = require('express');
const authRoutes = require('./routes/auth.routes');
const materialRoutes = require('./routes/material.routes');
const userRoutes = require('./routes/user.routes');
const quizzesRoutes = require('./routes/quizzes.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const progressRoutes = require('./routes/progress.routes');
const { escape } = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);   // Checked
app.use('/api/materials', materialRoutes);  // Checked
app.use('/api/users', userRoutes);  // Checked
app.use('/api/quizzes', quizzesRoutes);  // Checked
app.use('/api/assignment', assignmentRoutes);  // Checked
app.use('/api/progress', progressRoutes);  // Checked

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});