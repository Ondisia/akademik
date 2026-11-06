require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10kb' }));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const scheduleRoutes = require('./routes/schedules');
const gradeRoutes = require('./routes/grades');
const attendanceRoutes = require('./routes/attendances');
const announcementRoutes = require('./routes/announcements');
const billingRoutes = require('./routes/billings');
const settingsRoutes = require('./routes/settings');
const ekskulRoutes = require('./routes/ekskul');
const prestasiRoutes = require('./routes/prestasi');
const relationRoutes = require('./routes/relations');

// Mounting Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/bills', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ekskul', ekskulRoutes);
app.use('/api/prestasi', prestasiRoutes);
app.use('/api/relations', relationRoutes);

// Endpoint dasar (Home)
app.get('/', (req, res) => {
  res.send('Halo! Backend API Sistem Akademik SMK sudah berjalan!');
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server aktif di http://localhost:${port}`);
});
