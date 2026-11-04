const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak: hanya admin yang bisa mengubah pengaturan.' });
    }
    next();
};

const HELP_CONTACT_KEY = 'help-contacts';
const defaultHelpContacts = {
    wa: ['', ''],
    ig: ['', '']
};

const getStoredHelpContacts = () => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(HELP_CONTACT_KEY);
    if (!row || !row.value) return defaultHelpContacts;

    try {
        const parsed = JSON.parse(row.value);
        return {
            wa: Array.isArray(parsed.wa) ? parsed.wa.slice(0, 2) : ['', ''],
            ig: Array.isArray(parsed.ig) ? parsed.ig.slice(0, 2) : ['', '']
        };
    } catch (err) {
        return defaultHelpContacts;
    }
};

router.get('/help-contacts', authenticateToken, (req, res) => {
    res.json(getStoredHelpContacts());
});

router.put('/help-contacts', authenticateToken, authorizeAdmin, (req, res) => {
    const { wa, ig } = req.body;

    if (!Array.isArray(wa) || !Array.isArray(ig)) {
        return res.status(400).json({ message: 'Format data tidak valid. wa dan ig harus berupa array.' });
    }

    const payload = {
        wa: wa.slice(0, 2).map(item => String(item || '').trim()),
        ig: ig.slice(0, 2).map(item => String(item || '').trim())
    };

    const value = JSON.stringify(payload);
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(HELP_CONTACT_KEY, value);

    res.json(payload);
});

module.exports = router;
