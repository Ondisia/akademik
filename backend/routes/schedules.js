const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// GET /api/schedules
router.get('/', authenticateToken, (req, res) => {
  const { class: classFilter } = req.query;
  let query = 'SELECT * FROM schedules';
  const params = [];

  if (classFilter) {
    query += ' WHERE class = ?';
    params.push(classFilter);
  }
  query += ' ORDER BY class ASC, time ASC';

  const schedules = db.prepare(query).all(...params);
  res.json(schedules);
});

// GET /api/schedules/:id
router.get('/:id', authenticateToken, (req, res) => {
  const schedule = db.prepare('SELECT * FROM schedules WHERE id = ?').get(req.params.id);
  if (!schedule) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
  res.json(schedule);
});

// POST /api/schedules
router.post('/', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { class: schedClass, time, subject, teacher, room } = req.body;

  if (!schedClass || !time || !subject || !teacher || !room) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const id = Date.now().toString();

  db.prepare(`
    INSERT INTO schedules (id, class, time, subject, teacher, room)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, schedClass, time, subject, teacher, room);

  const newSchedule = db.prepare('SELECT * FROM schedules WHERE id = ?').get(id);
  res.status(201).json(newSchedule);
});

// PUT /api/schedules/:id
router.put('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const { class: schedClass, time, subject, teacher, room } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM schedules WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });

  db.prepare(`
    UPDATE schedules SET class = ?, time = ?, subject = ?, teacher = ?, room = ?
    WHERE id = ?
  `).run(
    schedClass ?? existing.class,
    time ?? existing.time,
    subject ?? existing.subject,
    teacher ?? existing.teacher,
    room ?? existing.room,
    id
  );

  const updated = db.prepare('SELECT * FROM schedules WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/schedules/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'guru'), (req, res) => {
  const result = db.prepare('DELETE FROM schedules WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
  res.json({ message: 'Jadwal berhasil dihapus' });
});

module.exports = router;
