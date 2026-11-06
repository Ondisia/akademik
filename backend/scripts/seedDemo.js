/**
 * Demo seed for the SQLite branch.
 * Idempotent: safe to run repeatedly; existing rows are left untouched.
 * Usage: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../database');
const { v4: uuid } = require('uuid');

const today = new Date();
const iso = (d) => d.toISOString();
const ymd = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};

const users = [
  { email: 'admin@example.com', password: 'Password123', name: 'Administrator', role: 'admin' },
  { email: 'guru@smk.id', password: 'guru123', name: 'Budi Santoso, S.Kom.', role: 'guru' },
  { email: 'siswa@smk.id', password: 'siswa123', name: 'Ahmad Fauzi', role: 'siswa' },
  { email: 'ortu@smk.id', password: 'ortu123', name: 'Siti Aminah', role: 'orang_tua' },
  { id: 'user-kepsek', email: 'kepsek@smk.id', password: 'Password123', name: 'Kepala Sekolah', role: 'kepala_sekolah' },
  { id: 'user-waka', email: 'waka@smk.id', password: 'Password123', name: 'Wakil Kepala Sekolah', role: 'waka' },
  { id: 'user-wali1', email: 'wali1@smk.id', password: 'Password123', name: 'Wali Kelas X RPL 1', role: 'wali_kelas', class: 'X RPL 1' },
  { id: 'user-guru1', email: 'guru1@smk.id', password: 'Password123', name: 'Guru Mapel', role: 'guru_mapel' },
  { id: 'user-kepalatu', email: 'kepalatu@smk.id', password: 'Password123', name: 'Kepala Tata Usaha', role: 'kepala_tu' },
  { id: 'user-stafftu', email: 'stafftu@smk.id', password: 'Password123', name: 'Staff Tata Usaha', role: 'staff_tu' }
];

const students = [
  ['std-001', 'Ahmad Fauzi', 'NJ2026001', 'Laki-laki', 'X RPL 1', 'siswa aktif'],
  ['std-002', 'Bella Putri Lestari', 'NJ2026002', 'Perempuan', 'X RPL 1', 'siswa aktif'],
  ['std-003', 'Candra Wijaya', 'NJ2026003', 'Laki-laki', 'X RPL 1', 'siswa aktif'],
  ['std-004', 'Dewi Anggraini', 'NJ2026004', 'Perempuan', 'X RPL 1', 'siswa aktif'],
  ['std-005', 'Eko Prasetyo', 'NJ2026005', 'Laki-laki', 'XI RPL 1', 'siswa aktif'],
  ['std-006', 'Fitri Handayani', 'NJ2026006', 'Perempuan', 'XI RPL 1', 'siswa aktif'],
  ['std-007', 'Gilang Ramadhan', 'NJ2026007', 'Laki-laki', 'XI RPL 1', 'siswa aktif'],
  ['std-008', 'Hana Safira', 'NJ2026008', 'Perempuan', 'XI RPL 1', 'siswa aktif'],
  ['std-009', 'Irfan Maulana', 'NJ2026009', 'Laki-laki', 'XII TKJ 1', 'siswa aktif'],
  ['std-010', 'Jihan Aulia', 'NJ2026010', 'Perempuan', 'XII TKJ 1', 'siswa aktif'],
  ['std-011', 'Kurniawan Adi', 'NJ2026011', 'Laki-laki', 'XII TKJ 1', 'siswa aktif'],
  ['std-012', 'Lestari Ningsih', 'NJ2026012', 'Perempuan', 'XII TKJ 1', 'siswa lulus']
];

const teachers = [
  ['teacher-001', 'Budi Santoso, S.Kom.', 'GJ2001', 'Laki-laki', ['Informatika', 'Pemrograman Web'], ['X RPL 1', 'XI RPL 1']],
  ['teacher-002', 'Rina Marlina, S.Pd.', 'GJ2002', 'Perempuan', ['Matematika'], ['X RPL 1', 'XII TKJ 1']],
  ['teacher-003', 'Agus Setiawan, M.Pd.', 'GJ2003', 'Laki-laki', ['Bahasa Indonesia'], ['X RPL 1', 'XI RPL 1', 'XII TKJ 1']],
  ['teacher-004', 'Nurul Hidayah, S.Pd.', 'GJ2004', 'Perempuan', ['Bahasa Inggris'], ['XI RPL 1', 'XII TKJ 1']],
  ['teacher-005', 'Hendra Gunawan, S.T.', 'GJ2005', 'Laki-laki', ['Jaringan Komputer'], ['XII TKJ 1']]
];

const schedules = [
  ['sched-001', 'X RPL 1', '07:00 - 08:30', 'Matematika', 'Rina Marlina, S.Pd.', 'R-101'],
  ['sched-002', 'X RPL 1', '08:30 - 10:00', 'Informatika', 'Budi Santoso, S.Kom.', 'Lab Kom 1'],
  ['sched-003', 'X RPL 1', '10:15 - 11:45', 'Bahasa Indonesia', 'Agus Setiawan, M.Pd.', 'R-101'],
  ['sched-004', 'X RPL 1', '13:00 - 14:30', 'Pemrograman Web', 'Budi Santoso, S.Kom.', 'Lab Kom 1'],
  ['sched-005', 'XI RPL 1', '07:00 - 08:30', 'Pemrograman Web', 'Budi Santoso, S.Kom.', 'Lab Kom 2'],
  ['sched-006', 'XI RPL 1', '08:30 - 10:00', 'Bahasa Inggris', 'Nurul Hidayah, S.Pd.', 'R-202'],
  ['sched-007', 'XI RPL 1', '10:15 - 11:45', 'Matematika', 'Rina Marlina, S.Pd.', 'R-202'],
  ['sched-008', 'XI RPL 1', '13:00 - 14:30', 'Bahasa Indonesia', 'Agus Setiawan, M.Pd.', 'R-202'],
  ['sched-009', 'XII TKJ 1', '07:00 - 08:30', 'Jaringan Komputer', 'Hendra Gunawan, S.T.', 'Lab Jaringan'],
  ['sched-010', 'XII TKJ 1', '08:30 - 10:00', 'Matematika', 'Rina Marlina, S.Pd.', 'R-303'],
  ['sched-011', 'XII TKJ 1', '10:15 - 11:45', 'Bahasa Inggris', 'Nurul Hidayah, S.Pd.', 'R-303'],
  ['sched-012', 'XII TKJ 1', '13:00 - 14:30', 'Bahasa Indonesia', 'Agus Setiawan, M.Pd.', 'R-303']
];

const announcements = [
  ['ann-001', 'Ujian Tengah Semester Ganjil', 'UTS dilaksanakan 18-22 November 2026. Siswa wajib membawa kartu ujian.', 'Administrator', 'akademik', iso(daysAgo(1))],
  ['ann-002', 'Pembayaran SPP Bulan November', 'Batas akhir pembayaran SPP November adalah 15 November 2026.', 'Administrator', 'keuangan', iso(daysAgo(2))],
  ['ann-003', 'Praktik Kerja Lapangan Kelas XII', 'Sosialisasi PKL untuk kelas XII akan diadakan di aula sekolah hari Jumat.', 'Budi Santoso, S.Kom.', 'info', iso(daysAgo(4))]
];

const subjects = ['Matematika', 'Bahasa Indonesia', 'Pemrograman Web'];
const attendanceStatuses = ['hadir', 'hadir', 'hadir', 'hadir', 'izin', 'hadir', 'alfa', 'hadir', 'hadir', 'hadir'];

function seedUsers() {
  const find = db.prepare('SELECT id FROM users WHERE email = ?');
  const insert = db.prepare(
    'INSERT OR IGNORE INTO users (id, name, email, password, role, class) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  for (const u of users) {
    if (find.get(u.email)) continue;
    added += insert.run(
      u.id || uuid(),
      u.name,
      u.email,
      bcrypt.hashSync(u.password, 10),
      u.role,
      u.class || null
    ).changes;
  }
  return added;
}

function seedStudents() {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO students (id, name, niup, gender, class, status) VALUES (?, ?, ?, ?, ?, ?)"
  );
  let added = 0;
  for (const s of students) added += insert.run(...s).changes;
  return added;
}

function seedTeachers() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO teachers (id, name, niup, gender, subjects, classes) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  for (const [id, name, niup, gender, subs, classes] of teachers) {
    added += insert.run(id, name, niup, gender, JSON.stringify(subs), JSON.stringify(classes)).changes;
  }
  return added;
}

function seedSchedules() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO schedules (id, class, time, subject, teacher, room) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  for (const s of schedules) added += insert.run(...s).changes;
  return added;
}

function seedAnnouncements() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO announcements (id, title, content, author, category, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  for (const a of announcements) added += insert.run(...a).changes;
  return added;
}

function seedGrades() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO grades (id, student_id, student_name, subject, score, date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  let i = 0;
  for (const s of students) {
    for (const subject of subjects) {
      const score = 72 + ((i * 7 + subject.length) % 25);
      const id = `grade-${s[0]}-${subject.replace(/\s+/g, '-').toLowerCase()}`;
      added += insert.run(id, s[0], s[1], subject, score, ymd(daysAgo(10 + (i % 5)))).changes;
      i++;
    }
  }
  return added;
}

function seedAttendances() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO attendances (id, student_id, student_name, date, status, note) VALUES (?, ?, ?, ?, ?, ?)'
  );
  let added = 0;
  for (let d = 0; d < 7; d++) {
    const date = ymd(daysAgo(d));
    students.forEach((s, idx) => {
      const status = attendanceStatuses[(idx + d) % attendanceStatuses.length];
      const note = status === 'izin' ? 'Izin keperluan keluarga' : null;
      added += insert.run(`att-${s[0]}-${date}`, s[0], s[1], date, status, note).changes;
    });
  }
  return added;
}

function seedBills() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO bills
      (id, student_id, student_name, amount, period, description, status, payment_proof, proof_filename, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const periods = [
    ['2026-09', 'September 2026'],
    ['2026-10', 'Oktober 2026'],
    ['2026-11', 'November 2026']
  ];
  const statuses = ['paid', 'pending_verification', 'requested', 'paid'];
  let added = 0;
  students.forEach((s, idx) => {
    periods.forEach(([period, label], pIdx) => {
      const status = statuses[(idx + pIdx) % statuses.length];
      added += insert.run(
        `bill-${s[0]}-${period}`,
        s[0],
        s[1],
        350000,
        period,
        `SPP Bulan ${label}`,
        status,
        null,
        null,
        iso(daysAgo(30 - pIdx * 5)),
        iso(daysAgo(20 - pIdx * 5))
      ).changes;
    });
  });
  return added;
}

function seedSettings() {
  const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  return insert.run(
    'help-contacts',
    JSON.stringify({ wa: ['+628123456789', ''], ig: ['smk_nuruljadid', ''] })
  ).changes;
}

function seedEkskul() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO ekskul (id, nama, pembina, jadwal, deskripsi, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const rows = [
    ['ekskul-001', 'PMR', 'Rina Marlina, S.Pd.', 'Senin 15:00-16:30', 'Unit Pengamalan Pertama Pada Kecelakaan untuk siswa', iso(daysAgo(30))],
    ['ekskul-002', 'Robotika', 'Budi Santoso, S.Kom.', 'Rabu 14:00-16:00', 'Pembuatan robot dan pemrograman mikrokontroler', iso(daysAgo(28))],
    ['ekskul-003', 'Basket', 'Agus Setiawan, M.Pd.', 'Jumat 16:00-18:00', 'Kegiatan olahraga basket dan pelatihan tim', iso(daysAgo(25))],
    ['ekskul-004', 'Pramuka', 'Nurul Hidayah, S.Pd.', 'Sabtu 08:00-11:00', 'Kegiatan pramuka dan keterampilan hidup di alam', iso(daysAgo(22))]
  ];
  let added = 0;
  for (const e of rows) added += insert.run(...e).changes;
  return added;
}

function seedPrestasi() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO prestasi (id, student_id, student_name, class, kategori, juara, event, tahun, deskripsi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const rows = [
    ['prestasi-001', 'std-001', 'Ahmad Fauzi', 'X RPL 1', 'Olimpiade Sains', 'Juara 1', 'OSN Matematika Provinsi', '2026', 'Juara pertama OSN Matematika tingkat provinsi'],
    ['prestasi-002', 'std-002', 'Bella Putri Lestari', 'X RPL 1', 'Lomba Robot', 'Juara 2', 'KRTI Robotika', '2026', 'Juara dua lomba robot terpadu'],
    ['prestasi-003', 'std-005', 'Eko Prasetyo', 'XI RPL 1', 'Olahraga', 'Juara 3', 'Piala Baskot Provinsi', '2026', 'Juara tiga basket kelas menengah'],
    ['prestasi-004', 'std-007', 'Gilang Ramadhan', 'XI RPL 1', 'Ilmu Pengetahuan', 'Juara 1', 'Lomba Karya Ilmiah Remaja', '2026', 'Juara satu karya ilmiah teknologi'],
    ['prestasi-005', 'std-009', 'Irfan Maulana', 'XII TKJ 1', 'Jaringan', 'Juara 2', 'Cisco Networking Competition', '2025', 'Juara dua kompetisi jaringan nasional'],
    ['prestasi-006', 'std-010', 'Jihan Aulia', 'XII TKJ 1', 'Bahasa', 'Juara 3', 'Lomba Bahasa Indonesia', '2025', 'Juara tiga lomba alfabetisasi'],
    ['prestasi-007', 'std-003', 'Candra Wijaya', 'X RPL 1', 'Pemrograman', 'Juara 1', 'OSP Pemrograman Web', '2026', 'Juara satu olahraga pemrograman web'],
    ['prestasi-008', 'std-012', 'Lestari Ningsih', 'XII TKJ 1', 'Prestasi Siswa', 'Juara 2', 'Siswa Berprestasi Tingkat Provinsi', '2026', 'Juara dua siswa berprestasi provinsi']
  ];
  let added = 0;
  for (const p of rows) added += insert.run(...p).changes;
  return added;
}

const run = db.transaction(() => ({
  users: seedUsers(),
  students: seedStudents(),
  teachers: seedTeachers(),
  schedules: seedSchedules(),
  announcements: seedAnnouncements(),
  grades: seedGrades(),
  attendances: seedAttendances(),
  bills: seedBills(),
  settings: seedSettings(),
  ekskul: seedEkskul(),
  prestasi: seedPrestasi()
}));

const added = run();
console.log('Demo seed complete. Inserted rows:', added);
console.log('Logins:');
console.log('  admin@example.com / Password123');
console.log('  guru@smk.id / guru123');
console.log('  siswa@smk.id / siswa123');
console.log('  ortu@smk.id / ortu123');
console.log('  kepsek@smk.id / Password123');
console.log('  waka@smk.id / Password123');
console.log('  wali1@smk.id / Password123');
console.log('  guru1@smk.id / Password123');
console.log('  kepalatu@smk.id / Password123');
console.log('  stafftu@smk.id / Password123');
