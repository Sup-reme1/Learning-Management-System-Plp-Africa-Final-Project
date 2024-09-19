const express = require('express');
const authRoutes = require('./routes/auth.routes');
const materialRoutes = require('./routes/material.routes');
const userRoutes = require('./routes/user.routes');
const { escape } = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});