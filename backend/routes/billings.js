const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
};

// GET /api/bills
router.get('/', authenticateToken, (req, res) => {
    const { studentId, status } = req.query;
    let query = `SELECT b.*, s.name AS student_name FROM bills b JOIN students s ON b.student_id = s.id`;
    const params = [];
    const conditions = [];

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
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
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
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status, paymentProof, proofFilename } = req.body;

    const existing = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    if (!existing) {
        return res.status(404).json({ message: 'Tagihan tidak ditemukan' });
    }

    const userRole = req.user.role;
    const updatedAt = new Date().toISOString();
    let updatedBill;

    if (userRole === 'admin') {
        const nextStatus = status || existing.status;
        db.prepare(`
      UPDATE bills SET status = ?, updated_at = ? WHERE id = ?
    `).run(nextStatus, updatedAt, id);
    } else if (userRole === 'orang_tua') {
        if (!paymentProof || !proofFilename) {
            return res.status(400).json({ message: 'Bukti bayar wajib diunggah oleh orang tua' });
        }

        db.prepare(`
      UPDATE bills SET payment_proof = ?, proof_filename = ?, status = ?, updated_at = ? WHERE id = ?
    `).run(paymentProof, proofFilename, 'pending_verification', updatedAt, id);
    } else {
        return res.status(403).json({ message: 'Hanya admin atau orang tua yang dapat memperbarui data tagihan' });
    }

    updatedBill = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    res.json(updatedBill);
});

module.exports = router;
