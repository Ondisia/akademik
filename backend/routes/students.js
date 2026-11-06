const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Batasi data sesuai peran; dipakai untuk daftar dan detail.
function scopeFor(user) {
  if (user.role === 'siswa') return { sql: 'id = ?', params: [user.id] };
  if (user.role === 'wali_kelas' && user.class) return { sql: 'class = ?', params: [user.class] };
  // TODO: orang_tua belum punya relasi anak, sementara tampil semua
  return { sql: '1 = 1', params: [] };
}

// GET /api/students — ambil semua siswa
router.get('/', authenticateToken, (req, res) => {
  const { search, class: classFilter } = req.query;
  let query = 'SELECT * FROM students';
  const scope = scopeFor(req.user);
  const params = [...scope.params];
  const conditions = [scope.sql];

  if (search) {
    conditions.push("(name LIKE ? OR niup LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (classFilter) {
    conditions.push("class = ?");
    params.push(classFilter);
  }

  query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY name ASC';

  const students = db.prepare(query).all(...params);
  res.json(students);
});

// GET /api/students/:id
router.get('/:id', authenticateToken, (req, res) => {
  const scope = scopeFor(req.user);
  const student = db
    .prepare(`SELECT * FROM students WHERE id = ? AND (${scope.sql})`)
    .get(req.params.id, ...scope.params);
  if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
  res.json(student);
});

// POST /api/students — tambah siswa
router.post('/', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
  const { name, niup, gender, class: studentClass, status } = req.body;

  if (!name || !niup || !gender || !studentClass) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `std-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  try {
    db.prepare(`
      INSERT INTO students (id, name, niup, gender, class, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, niup, gender, studentClass, status || 'siswa aktif');

    const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.status(201).json(newStudent);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'NIUP sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/students/:id — update siswa
router.put('/:id', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
  const { name, niup, gender, class: studentClass, status } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

  try {
    db.prepare(`
      UPDATE students SET name = ?, niup = ?, gender = ?, class = ?, status = ?
      WHERE id = ?
    `).run(
      name ?? existing.name,
      niup ?? existing.niup,
      gender ?? existing.gender,
      studentClass ?? existing.class,
      status ?? existing.status,
      id
    );

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'NIUP sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/students/:id — hapus siswa
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
  const result = db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
  res.json({ message: 'Siswa berhasil dihapus' });
});

// POST /api/students/bulk — import masal
router.post('/bulk', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: 'Data siswa tidak valid' });
  }

  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO students (id, name, niup, gender, class, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const bulkInsert = db.transaction((students) => {
    const results = [];
    for (const s of students) {
      const id = `std-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      insertStudent.run(id, s.name, s.niup, s.gender, s.class, s.status || 'siswa aktif');
      results.push({ ...s, id });
    }
    return results;
  });

  try {
    const results = bulkInsert(students);
    res.status(201).json({ message: `${results.length} siswa berhasil diimpor`, students: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
