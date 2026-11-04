const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'school.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    niup TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL,
    class TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'siswa aktif'
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    niup TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL,
    subjects TEXT NOT NULL DEFAULT '[]',
    classes TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'info',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS grades (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendances (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'hadir',
    note TEXT
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    class TEXT NOT NULL,
    time TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher TEXT NOT NULL,
    room TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'requested',
    payment_proof TEXT,
    proof_filename TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ekskul (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    pembina TEXT,
    jadwal TEXT,
    deskripsi TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS prestasi (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT,
    class TEXT,
    kategori TEXT,
    juara TEXT,
    event TEXT,
    tahun TEXT,
    deskripsi TEXT
  );
`);

module.exports = db;
