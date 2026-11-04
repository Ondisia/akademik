const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Helper: parse JSON fields
function parseTeacher(t) {
  return {
    ...t,
    subjects: JSON.parse(t.subjects || '[]'),
    classes: JSON.parse(t.classes || '[]')
  };
}

// GET /api/teachers
router.get('/', authenticateToken, (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM teachers';
  const params = [];

  if (search) {
    query += " WHERE name LIKE ? OR niup LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY name ASC';

  const teachers = db.prepare(query).all(...params).map(parseTeacher);
  res.json(teachers);
});

// GET /api/teachers/:id
router.get('/:id', authenticateToken, (req, res) => {
  const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(req.params.id);
  if (!teacher) return res.status(404).json({ message: 'Guru tidak ditemukan' });
  res.json(parseTeacher(teacher));
});

// POST /api/teachers
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { name, niup, gender, subjects, classes } = req.body;

  if (!name || !niup || !gender) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  try {
    db.prepare(`
      INSERT INTO teachers (id, name, niup, gender, subjects, classes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, niup, gender, JSON.stringify(subjects || []), JSON.stringify(classes || []));

    const newTeacher = parseTeacher(db.prepare('SELECT * FROM teachers WHERE id = ?').get(id));
    res.status(201).json(newTeacher);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'NIUP sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/teachers/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { name, niup, gender, subjects, classes } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Guru tidak ditemukan' });

  const existingParsed = parseTeacher(existing);

  try {
    db.prepare(`
      UPDATE teachers SET name = ?, niup = ?, gender = ?, subjects = ?, classes = ?
      WHERE id = ?
    `).run(
      name ?? existingParsed.name,
      niup ?? existingParsed.niup,
      gender ?? existingParsed.gender,
      JSON.stringify(subjects ?? existingParsed.subjects),
      JSON.stringify(classes ?? existingParsed.classes),
      id
    );

    const updated = parseTeacher(db.prepare('SELECT * FROM teachers WHERE id = ?').get(id));
    res.json(updated);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'NIUP sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/teachers/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const result = db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });
  res.json({ message: 'Guru berhasil dihapus' });
});

// POST /api/teachers/bulk — import masal
router.post('/bulk', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { teachers } = req.body;
  if (!Array.isArray(teachers) || teachers.length === 0) {
    return res.status(400).json({ message: 'Data guru tidak valid' });
  }

  const upsertTeacher = db.prepare(`
    INSERT INTO teachers (id, name, niup, gender, subjects, classes)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(niup) DO UPDATE SET
      name = excluded.name,
      gender = excluded.gender,
      subjects = excluded.subjects
  `);

  const bulkInsert = db.transaction((teachers) => {
    let added = 0, updated = 0;
    for (const t of teachers) {
      const exists = db.prepare('SELECT id FROM teachers WHERE niup = ?').get(t.niup);
      const id = exists ? exists.id : `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      upsertTeacher.run(id, t.name, t.niup, t.gender, JSON.stringify(t.subjects || []), JSON.stringify(t.classes || []));
      if (exists) updated++; else added++;
    }
    return { added, updated };
  });

  try {
    const { added, updated } = bulkInsert(teachers);
    res.status(201).json({ message: `${added} ditambahkan, ${updated} diperbarui` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
