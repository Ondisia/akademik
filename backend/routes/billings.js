const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');
const { billingScope, isChildOf, getRoles } = require('../scope');

// GET /api/bills
router.get('/', authenticateToken, (req, res) => {
    const userRoles = getRoles(req.user);
    const TEACHER_ONLY = ['guru_mapel', 'guru'];

    // Guru murni tidak memiliki akses ke tagihan.
    // Multi-role (misal wali_kelas + guru_mapel) tetap boleh via scope role lain.
    if (userRoles.length > 0 && userRoles.every((r) => TEACHER_ONLY.includes(r))) {
        return res.status(403).json({ message: 'Akses ditolak: guru tidak memiliki akses ke tagihan' });
    }

    const scope = billingScope(req.user);

    const { studentId, status } = req.query;
    let query = `SELECT b.*, s.name AS student_name FROM bills b JOIN students s ON b.student_id = s.id`;
    const params = [...scope.params];
    const conditions = [scope.sql];

    if (studentId) {
        conditions.push('b.student_id = ?');
        params.push(studentId);
    }
    if (status) {
        conditions.push('b.status = ?');
        params.push(status);
    }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY b.created_at DESC';

    const bills = db.prepare(query).all(...params);
    res.json(bills);
});

// POST /api/bills
router.post('/', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
    const { studentId, amount, period, description } = req.body;

    if (!studentId || !amount || !period) {
        return res.status(400).json({ message: 'Data tagihan tidak lengkap' });
    }

    const student = db.prepare('SELECT id, name FROM students WHERE id = ?').get(studentId);
    if (!student) {
        return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    const id = `bill-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    db.prepare(`
    INSERT INTO bills (
      id, student_id, student_name, amount, period, description,
      status, payment_proof, proof_filename, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id,
        student.id,
        student.name,
        amount,
        period,
        description || '',
        'requested',
        null,
        null,
        createdAt,
        updatedAt
    );

    const bill = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    res.status(201).json(bill);
});

// PUT /api/bills/:id
// Orang tua tetap boleh mengunggah bukti bayar (hanya field bukti).
router.put('/:id', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu', 'orang_tua'), (req, res) => {
    const { id } = req.params;
    const { status, paymentProof, proofFilename } = req.body;

    const existing = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    if (!existing) {
        return res.status(404).json({ message: 'Tagihan tidak ditemukan' });
    }

    const userRoles = getRoles(req.user);
    const updatedAt = new Date().toISOString();

    if (userRoles.includes('orang_tua')) {
        if (!isChildOf(req.user, existing.student_id)) {
            return res.status(403).json({ message: 'Akses ditolak: tagihan bukan milik anak Anda' });
        }
        if (!paymentProof || !proofFilename) {
            return res.status(400).json({ message: 'Bukti bayar wajib diunggah oleh orang tua' });
        }

        db.prepare(`
      UPDATE bills SET payment_proof = ?, proof_filename = ?, status = ?, updated_at = ? WHERE id = ?
    `).run(paymentProof, proofFilename, 'pending_verification', updatedAt, id);
    } else {
        const nextStatus = status || existing.status;
        db.prepare(`
      UPDATE bills SET status = ?, updated_at = ? WHERE id = ?
    `).run(nextStatus, updatedAt, id);
    }

    const updatedBill = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    res.json(updatedBill);
});

// DELETE /api/bills/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'kepala_tu', 'staff_tu'), (req, res) => {
    const result = db.prepare('DELETE FROM bills WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: 'Tagihan tidak ditemukan' });
    res.json({ message: 'Tagihan berhasil dihapus' });
});

module.exports = router;
