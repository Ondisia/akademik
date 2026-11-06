const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

function mapAttendance(a) {
  return {
    id: a.id,
    studentId: a.student_id,
    studentName: a.student_name,
    date: a.date,
    status: a.status,
    note: a.note || ''
  };
}

// Batasi data absensi sesuai peran; dipakai untuk daftar.
function scopeFor(user) {
  if (user.role === 'siswa') return { sql: 'student_id = ?', params: [user.id] };
  if (user.role === 'wali_kelas' && user.class) {
    return { sql: 'student_id IN (SELECT id FROM students WHERE class = ?)', params: [user.class] };
  }
  // TODO: guru_mapel belum punya relasi mapel-kelas; orang_tua belum punya relasi anak
  return { sql: '1 = 1', params: [] };
}

// GET /api/attendances
router.get('/', authenticateToken, (req, res) => {
  const { date, studentId, status } = req.query;
  let query = 'SELECT * FROM attendances';
  const scope = scopeFor(req.user);
  const params = [...scope.params];
  const conditions = [scope.sql];

  if (date) {
    conditions.push('date = ?');
    params.push(date);
  }
  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY date DESC';

  const attendances = db.prepare(query).all(...params).map(mapAttendance);
  res.json(attendances);
});

// GET /api/attendances/stats — statistik hari ini
router.get('/stats/today', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const rows = db.prepare('SELECT status, COUNT(*) as count FROM attendances WHERE date = ? GROUP BY status').all(today);

  const stats = { total: 0, present: 0, absent: 0, permission: 0 };
  for (const row of rows) {
    stats.total += row.count;
    if (row.status === 'hadir') stats.present += row.count;
    else if (row.status === 'alfa') stats.absent += row.count;
    else if (row.status === 'izin') stats.permission += row.count;
  }
  res.json(stats);
});

// POST /api/attendances — simpan satu/banyak absensi
router.post('/', authenticateToken, authorizeRoles('admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'), (req, res) => {
  const { attendances } = req.body;

  if (!Array.isArray(attendances) || attendances.length === 0) {
    return res.status(400).json({ message: 'Data absensi tidak valid' });
  }

  const upsert = db.prepare(`
    INSERT INTO attendances (id, student_id, student_name, date, status, note)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status = excluded.status, note = excluded.note
  `);

  const saveAll = db.transaction((list) => {
    for (const a of list) {
      const id = a.id || `att-${a.studentId}-${a.date}`;
      upsert.run(id, a.studentId, a.studentName || '', a.date, a.status || 'hadir', a.note || null);
    }
  });

  try {
    saveAll(attendances);
    res.status(201).json({ message: 'Absensi berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/attendances/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'), (req, res) => {
  const result = db.prepare('DELETE FROM attendances WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Data absensi tidak ditemukan' });
  res.json({ message: 'Absensi berhasil dihapus' });
});

module.exports = router;
