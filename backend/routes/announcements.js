const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');
const sanitizeLike = (str) => str.replace(/[%_]/g, '\\$&');

// Helper: map DB fields ke format frontend
function mapAnnouncement(a) {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    author: a.author,
    category: a.category,
    createdAt: a.created_at
  };
}

// GET /api/announcements
router.get('/', authenticateToken, (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM announcements';
  const params = [];
  const conditions = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (search) {
    conditions.push('(title LIKE ? OR content LIKE ?)');
    params.push(`%${sanitizeLike(search)}%`, `%${sanitizeLike(search)}%`);
  }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  const announcements = db.prepare(query).all(...params).map(mapAnnouncement);
  res.json(announcements);
});

// GET /api/announcements/:id
router.get('/:id', authenticateToken, (req, res) => {
  const ann = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  if (!ann) return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
  res.json(mapAnnouncement(ann));
});

// POST /api/announcements
router.post('/', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { title, content, author, category } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = `ann-${Date.now()}`;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO announcements (id, title, content, author, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, title, content, author, category || 'info', createdAt);

  const newAnn = mapAnnouncement(db.prepare('SELECT * FROM announcements WHERE id = ?').get(id));
  res.status(201).json(newAnn);
});

// PUT /api/announcements/:id
router.put('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { title, content, category } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });

  db.prepare(`
    UPDATE announcements SET title = ?, content = ?, category = ?
    WHERE id = ?
  `).run(
    title ?? existing.title,
    content ?? existing.content,
    category ?? existing.category,
    id
  );

  const updated = mapAnnouncement(db.prepare('SELECT * FROM announcements WHERE id = ?').get(id));
  res.json(updated);
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
  res.json({ message: 'Pengumuman berhasil dihapus' });
});

module.exports = router;
