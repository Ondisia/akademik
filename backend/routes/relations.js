const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

const READ_ROLES = ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu'];

// GET /api/relations/parents — daftar relasi orang tua -> siswa
router.get('/parents', authenticateToken, authorizeRoles(...READ_ROLES), (req, res) => {
  const rows = db.prepare(`
    SELECT ps.parent_id, u.name AS parent_name, u.email AS parent_email,
           ps.student_id, s.name AS student_name, s.class
    FROM parent_students ps
    JOIN users u ON u.id = ps.parent_id
    JOIN students s ON s.id = ps.student_id
    ORDER BY u.name, s.name
  `).all();
  res.json(rows);
});

// POST /api/relations/parents { parentEmail, studentId }
router.post('/parents', authenticateToken, authorizeRoles('admin', 'kepala_tu'), (req, res) => {
  const { parentEmail, studentId } = req.body;
  if (!parentEmail || !studentId) {
    return res.status(400).json({ message: 'Email orang tua dan siswa wajib diisi' });
  }

  const parent = db.prepare("SELECT id FROM users WHERE email = ? AND role = 'orang_tua'").get(parentEmail);
  if (!parent) return res.status(404).json({ message: 'Akun orang tua tidak ditemukan' });

  const student = db.prepare('SELECT id FROM students WHERE id = ?').get(studentId);
  if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

  db.prepare('INSERT OR IGNORE INTO parent_students (parent_id, student_id) VALUES (?, ?)').run(parent.id, studentId);
  res.status(201).json({ message: 'Relasi orang tua dan siswa tersimpan' });
});

// DELETE /api/relations/parents/:parentId/:studentId
router.delete('/parents/:parentId/:studentId', authenticateToken, authorizeRoles('admin', 'kepala_tu'), (req, res) => {
  const result = db
    .prepare('DELETE FROM parent_students WHERE parent_id = ? AND student_id = ?')
    .run(req.params.parentId, req.params.studentId);
  if (result.changes === 0) return res.status(404).json({ message: 'Relasi tidak ditemukan' });
  res.json({ message: 'Relasi dihapus' });
});

// GET /api/relations/teacher-assignments — daftar mapel/kelas yang diampu guru
router.get('/teacher-assignments', authenticateToken, authorizeRoles(...READ_ROLES), (req, res) => {
  const rows = db.prepare(`
    SELECT ta.id, ta.teacher_id, u.name AS teacher_name, u.email AS teacher_email,
           ta.subject, ta.class
    FROM teacher_assignments ta
    JOIN users u ON u.id = ta.teacher_id
    ORDER BY u.name, ta.class, ta.subject
  `).all();
  res.json(rows);
});

// POST /api/relations/teacher-assignments { teacherEmail, subject, class }
router.post('/teacher-assignments', authenticateToken, authorizeRoles('admin', 'kepala_sekolah'), (req, res) => {
  const { teacherEmail, subject, class: className } = req.body;
  if (!teacherEmail || !subject || !className) {
    return res.status(400).json({ message: 'Email guru, mapel, dan kelas wajib diisi' });
  }

  const teacher = db
    .prepare("SELECT id FROM users WHERE email = ? AND role IN ('guru', 'guru_mapel')")
    .get(teacherEmail);
  if (!teacher) return res.status(404).json({ message: 'Akun guru tidak ditemukan' });

  const id = `assign-${teacher.id}-${subject}-${className}`.replace(/\s+/g, '-').toLowerCase();
  try {
    db.prepare('INSERT INTO teacher_assignments (id, teacher_id, subject, class) VALUES (?, ?, ?, ?)')
      .run(id, teacher.id, subject, className);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'Penugasan tersebut sudah ada' });
    }
    return res.status(500).json({ message: err.message });
  }
  res.status(201).json({ id, teacherId: teacher.id, subject, class: className });
});

// DELETE /api/relations/teacher-assignments/:id
router.delete('/teacher-assignments/:id', authenticateToken, authorizeRoles('admin', 'kepala_sekolah'), (req, res) => {
  const result = db.prepare('DELETE FROM teacher_assignments WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Penugasan tidak ditemukan' });
  res.json({ message: 'Penugasan dihapus' });
});

module.exports = router;
