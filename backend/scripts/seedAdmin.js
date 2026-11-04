// Minimal seed for SQLite branch: inserts one admin user so the app can log in.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../database');
const { v4: uuid } = require('uuid');

const password = process.env.SEED_PASSWORD || 'Password123';
const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';

if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
  console.log('User already exists:', email);
  process.exit(0);
}

const id = uuid();
const hashed = bcrypt.hashSync(password, 10);
db.prepare(
  'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)'
).run(id, 'Administrator', email, hashed, 'admin');
console.log('Seeded admin:', email, password);
