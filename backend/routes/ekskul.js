const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// GET /api/ekskul (baca, semua role; tabel ekskul tidak memiliki kolom class)
router.get('/', authenticateToken, (req, res) => {
  const ekskul = db.prepare('SELECT * FROM ekskul ORDER BY nama ASC').all();
  res.json(ekskul);
});

// POST /api/ekskul (hanya admin)
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { nama, pembina, jadwal, deskripsi } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `ekskul-${Date.now()}`;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO ekskul (id, nama, pembina, jadwal, deskripsi, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, nama, pembina || '', jadwal || '', deskripsi || '', createdAt);

  const newEkskul = db.prepare('SELECT * FROM ekskul WHERE id = ?').get(id);
  res.status(201).json(newEkskul);
});

// PUT /api/ekskul/:id (hanya admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const { nama, pembina, jadwal, deskripsi } = req.body;

  const existing = db.prepare('SELECT * FROM ekskul WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Ekskul tidak ditemukan' });

  db.prepare(`
    UPDATE ekskul SET nama = ?, pembina = ?, jadwal = ?, deskripsi = ?
    WHERE id = ?
  `).run(
    nama ?? existing.nama,
    pembina ?? existing.pembina,
    jadwal ?? existing.jadwal,
    deskripsi ?? existing.deskripsi,
    id
  );

  const updated = db.prepare('SELECT * FROM ekskul WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/ekskul/:id (hanya admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const result = db.prepare('DELETE FROM ekskul WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Ekskul tidak ditemukan' });
  res.json({ message: 'Ekskul berhasil dihapus' });
});

module.exports = router;
