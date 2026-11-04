const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

function mapGrade(g) {
  return {
    id: g.id,
    studentId: g.student_id,
    studentName: g.student_name,
    subject: g.subject,
    score: g.score,
    date: g.date
  };
}

// GET /api/grades
router.get('/', authenticateToken, (req, res) => {
  const { studentId, subject } = req.query;
  let query = 'SELECT * FROM grades';
  const params = [];
  const conditions = [];

  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (subject) {
    conditions.push('subject = ?');
    params.push(subject);
  }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY date DESC';

  const grades = db.prepare(query).all(...params).map(mapGrade);
  res.json(grades);
});

// GET /api/grades/:id
router.get('/:id', authenticateToken, (req, res) => {
  const grade = db.prepare('SELECT * FROM grades WHERE id = ?').get(req.params.id);
  if (!grade) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });
  res.json(mapGrade(grade));
});

// POST /api/grades
router.post('/', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { studentId, studentName, subject, score, date } = req.body;

  if (!studentId || !studentName || !subject || score === undefined || !date) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `grade-${Date.now()}`;

  db.prepare(`
    INSERT INTO grades (id, student_id, student_name, subject, score, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, studentId, studentName, subject, score, date);

  const newGrade = mapGrade(db.prepare('SELECT * FROM grades WHERE id = ?').get(id));
  res.status(201).json(newGrade);
});

// PUT /api/grades/:id
router.put('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { studentId, studentName, subject, score, date } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM grades WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });

  db.prepare(`
    UPDATE grades SET student_id = ?, student_name = ?, subject = ?, score = ?, date = ?
    WHERE id = ?
  `).run(
    studentId ?? existing.student_id,
    studentName ?? existing.student_name,
    subject ?? existing.subject,
    score ?? existing.score,
    date ?? existing.date,
    id
  );

  const updated = mapGrade(db.prepare('SELECT * FROM grades WHERE id = ?').get(id));
  res.json(updated);
});

// DELETE /api/grades/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const result = db.prepare('DELETE FROM grades WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });
  res.json({ message: 'Data nilai berhasil dihapus' });
});

module.exports = router;
