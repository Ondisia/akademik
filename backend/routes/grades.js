const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');
const { isTeacher, recordScope, canManageStudent, canManageSubject } = require('../scope');

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

// Batasi data nilai sesuai peran; dipakai untuk daftar dan detail.
function scopeFor(user) {
  const scope = recordScope(user);
  if (!isTeacher(user)) return scope;
  // Guru mapel: hanya mapel yang diampu (kelas sudah dibatasi recordScope).
  return {
    sql: `${scope.sql} AND subject IN (SELECT subject FROM teacher_assignments WHERE teacher_id = ?)`,
    params: [...scope.params, user.id]
  };
}

// GET /api/grades
router.get('/', authenticateToken, (req, res) => {
  const { studentId, subject } = req.query;
  let query = 'SELECT * FROM grades';
  const scope = scopeFor(req.user);
  const params = [...scope.params];
  const conditions = [scope.sql];

  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (subject) {
    conditions.push('subject = ?');
    params.push(subject);
  }
  query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY date DESC';

  const grades = db.prepare(query).all(...params).map(mapGrade);
  res.json(grades);
});

// GET /api/grades/:id
router.get('/:id', authenticateToken, (req, res) => {
  const scope = scopeFor(req.user);
  const grade = db
    .prepare(`SELECT * FROM grades WHERE id = ? AND (${scope.sql})`)
    .get(req.params.id, ...scope.params);
  if (!grade) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });
  res.json(mapGrade(grade));
});

// POST /api/grades
router.post('/', authenticateToken, authorizeRoles('admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'), (req, res) => {
  const { studentId, studentName, subject, score, date } = req.body;

  if (!studentId || !studentName || !subject || score === undefined || !date) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  if (!canManageStudent(req.user, studentId, subject)) {
    return res.status(403).json({ message: 'Akses ditolak: bukan siswa/mapel yang Anda ampu' });
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
router.put('/:id', authenticateToken, authorizeRoles('admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'), (req, res) => {
  const { studentId, studentName, subject, score, date } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM grades WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });

  const nextStudentId = studentId ?? existing.student_id;
  const nextSubject = subject ?? existing.subject;
  if (!canManageSubject(req.user, nextSubject) || !canManageStudent(req.user, nextStudentId, nextSubject)) {
    return res.status(403).json({ message: 'Akses ditolak: bukan siswa/mapel yang Anda ampu' });
  }

  db.prepare(`
    UPDATE grades SET student_id = ?, student_name = ?, subject = ?, score = ?, date = ?
    WHERE id = ?
  `).run(
    nextStudentId,
    studentName ?? existing.student_name,
    nextSubject,
    score ?? existing.score,
    date ?? existing.date,
    id
  );

  const updated = mapGrade(db.prepare('SELECT * FROM grades WHERE id = ?').get(id));
  res.json(updated);
});

// DELETE /api/grades/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'), (req, res) => {
  const existing = db.prepare('SELECT * FROM grades WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Data nilai tidak ditemukan' });
  if (!canManageSubject(req.user, existing.subject) || !canManageStudent(req.user, existing.student_id, existing.subject)) {
    return res.status(403).json({ message: 'Akses ditolak: bukan siswa/mapel yang Anda ampu' });
  }

  db.prepare('DELETE FROM grades WHERE id = ?').run(req.params.id);
  res.json({ message: 'Data nilai berhasil dihapus' });
});

module.exports = router;
