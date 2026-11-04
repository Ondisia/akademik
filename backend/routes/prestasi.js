const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// GET /api/prestasi (baca, semua role; filter opsional ?class)
router.get('/', authenticateToken, (req, res) => {
  const { class: classFilter } = req.query;
  let query = 'SELECT * FROM prestasi';
  const params = [];
  const conditions = [];

  if (classFilter) {
    conditions.push('class = ?');
    params.push(classFilter);
  }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY tahun DESC, juara ASC';

  const prestasi = db.prepare(query).all(...params);
  res.json(prestasi);
});

// POST /api/prestasi (hanya admin)
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { student_id, student_name, class: classField, kategori, juara, event, tahun, deskripsi } = req.body;

  if (!student_id || !student_name || !classField || !kategori || !juara || !event || !tahun) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `prestasi-${Date.now()}`;

  db.prepare(`
    INSERT INTO prestasi (id, student_id, student_name, class, kategori, juara, event, tahun, deskripsi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, student_id, student_name, classField, kategori, juara, event, tahun, deskripsi || '');

  const newPrestasi = db.prepare('SELECT * FROM prestasi WHERE id = ?').get(id);
  res.status(201).json(newPrestasi);
});

// PUT /api/prestasi/:id (hanya admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const { student_id, student_name, class: classField, kategori, juara, event, tahun, deskripsi } = req.body;

  const existing = db.prepare('SELECT * FROM prestasi WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Prestasi tidak ditemukan' });

  db.prepare(`
    UPDATE prestasi SET student_id = ?, student_name = ?, class = ?, kategori = ?, juara = ?, event = ?, tahun = ?, deskripsi = ?
    WHERE id = ?
  `).run(
    student_id ?? existing.student_id,
    student_name ?? existing.student_name,
    classField ?? existing.class,
    kategori ?? existing.kategori,
    juara ?? existing.juara,
    event ?? existing.event,
    tahun ?? existing.tahun,
    deskripsi ?? existing.deskripsi,
    id
  );

  const updated = db.prepare('SELECT * FROM prestasi WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/prestasi/:id (hanya admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const result = db.prepare('DELETE FROM prestasi WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
  res.json({ message: 'Prestasi berhasil dihapus' });
});

module.exports = router;
