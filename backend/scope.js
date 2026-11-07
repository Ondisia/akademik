// Aturan pembatasan data per peran, mendukung multi-role (satu akun banyak peran).
// Izin dan data digabungkan (union) dari semua role yang dimiliki user.
//
// Contoh:
//   User roles = ['guru_mapel', 'wali_kelas']
//   - boleh tulis nilai via guru_mapel (mapel + kelas yang diampu)
//   - melihat data via wali_kelas (kelas walinya) UNION kelas yang diampu
const db = require('./database');

const TEACHER_ROLES = ['guru_mapel', 'guru'];
const FULL_ACCESS_ROLES = ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu'];

// Ambil daftar role user: kolom `roles` (JSON array) 우선, fallback ke `role` (string tunggal).
const getRoles = (user) => {
  if (user.roles) {
    try {
      const arr = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch {}
  }
  if (user.role) return [user.role];
  return [];
};

const hasRole = (user, role) => getRoles(user).includes(role);
const hasAnyRole = (user, roles) => roles.some((r) => getRoles(user).includes(r));
const isTeacher = (user) => hasAnyRole(user, TEACHER_ROLES);
const hasFullAccess = (user) => hasAnyRole(user, FULL_ACCESS_ROLES);

// Gabungkan beberapa {sql, params} dengan OR.
// Ada '1 = 1' (full access) → langsung semua. Kosong → 1 = 0 (tidak melihat apa-apa).
const unionScopes = (scopes) => {
  const valid = scopes.filter(Boolean);
  if (valid.length === 0) return { sql: '1 = 0', params: [] };
  if (valid.some((s) => s.sql === '1 = 1')) return { sql: '1 = 1', params: [] };
  return {
    sql: valid.map((s) => `(${s.sql})`).join(' OR '),
    params: valid.flatMap((s) => s.params)
  };
};

// Klausa pada tabel students (kolom id/class).
function studentScope(user) {
  const roles = getRoles(user);
  if (hasFullAccess(user)) return { sql: '1 = 1', params: [] };

  const scopes = [];
  if (roles.includes('siswa')) scopes.push({ sql: 'id = ?', params: [user.id] });
  if (roles.includes('orang_tua')) {
    scopes.push({
      sql: 'id IN (SELECT student_id FROM parent_students WHERE parent_id = ?)',
      params: [user.id]
    });
  }
  if (roles.includes('wali_kelas')) {
    scopes.push(user.class ? { sql: 'class = ?', params: [user.class] } : { sql: '1 = 0', params: [] });
  }
  if (isTeacher(user)) {
    scopes.push({
      sql: 'class IN (SELECT class FROM teacher_assignments WHERE teacher_id = ?)',
      params: [user.id]
    });
  }
  return unionScopes(scopes);
}

// Klausa pada tabel grades (student_id + subject). Guru dibatasi ke mapel yang diampu.
function gradeScope(user) {
  const roles = getRoles(user);
  if (hasFullAccess(user)) return { sql: '1 = 1', params: [] };

  const scopes = [];
  if (roles.includes('siswa')) scopes.push({ sql: 'student_id = ?', params: [user.id] });
  if (roles.includes('orang_tua')) {
    scopes.push({
      sql: 'student_id IN (SELECT student_id FROM parent_students WHERE parent_id = ?)',
      params: [user.id]
    });
  }
  if (roles.includes('wali_kelas')) {
    scopes.push(user.class ? { sql: 'student_id IN (SELECT id FROM students WHERE class = ?)', params: [user.class] } : { sql: '1 = 0', params: [] });
  }
  if (isTeacher(user)) {
    scopes.push({
      sql: 'student_id IN (SELECT s.id FROM students s JOIN teacher_assignments ta ON ta.class = s.class AND ta.subject = grades.subject WHERE ta.teacher_id = ?)',
      params: [user.id]
    });
  }
  return unionScopes(scopes);
}

// Klausa pada tabel attendances (student_id, tanpa subject).
function attendanceScope(user) {
  const roles = getRoles(user);
  if (hasFullAccess(user)) return { sql: '1 = 1', params: [] };

  const scopes = [];
  if (roles.includes('siswa')) scopes.push({ sql: 'student_id = ?', params: [user.id] });
  if (roles.includes('orang_tua')) {
    scopes.push({
      sql: 'student_id IN (SELECT student_id FROM parent_students WHERE parent_id = ?)',
      params: [user.id]
    });
  }
  if (roles.includes('wali_kelas')) {
    scopes.push(user.class ? { sql: 'student_id IN (SELECT id FROM students WHERE class = ?)', params: [user.class] } : { sql: '1 = 0', params: [] });
  }
  if (isTeacher(user)) {
    scopes.push({
      sql: 'student_id IN (SELECT id FROM students WHERE class IN (SELECT class FROM teacher_assignments WHERE teacher_id = ?))',
      params: [user.id]
    });
  }
  return unionScopes(scopes);
}

// Klausa pada tabel bills (student_id). Guru/guru_mapel tidak menambah cakupan
// sendiri, tapi juga tidak memblokir role lain (misal wali_kelas + guru_mapel).
// Jika user hanya punya role guru → tidak ada scope → 1 = 0 (tidak melihat apa-apa).
function billingScope(user) {
  const roles = getRoles(user);
  if (hasFullAccess(user)) return { sql: '1 = 1', params: [] };

  const scopes = [];
  if (roles.includes('siswa')) scopes.push({ sql: 'student_id = ?', params: [user.id] });
  if (roles.includes('orang_tua')) {
    scopes.push({
      sql: 'student_id IN (SELECT student_id FROM parent_students WHERE parent_id = ?)',
      params: [user.id]
    });
  }
  if (roles.includes('wali_kelas')) {
    scopes.push(user.class ? { sql: 'student_id IN (SELECT id FROM students WHERE class = ?)', params: [user.class] } : { sql: '1 = 0', params: [] });
  }
  return unionScopes(scopes);
}

// Guru/wali boleh menulis nilai/absensi siswa X jika siswa X dalam cakupan salah satu role.
function canManageStudent(user, studentId, subject) {
  const roles = getRoles(user);
  if (hasFullAccess(user)) return true;

  const checks = [];
  if (roles.includes('wali_kelas') && user.class) {
    checks.push(db.prepare('SELECT 1 FROM students WHERE id = ? AND class = ?').get(studentId, user.class));
  }
  if (isTeacher(user)) {
    const sql = `SELECT 1 FROM teacher_assignments ta JOIN students s ON s.class = ta.class
      WHERE ta.teacher_id = ? AND s.id = ?${subject ? ' AND ta.subject = ?' : ''}`;
    const params = subject ? [user.id, studentId, subject] : [user.id, studentId];
    checks.push(db.prepare(sql).get(...params));
  }
  return checks.some(Boolean);
}

// Guru boleh mengubah nilai pada mapel yang diampu.
function canManageSubject(user, subject) {
  if (hasFullAccess(user)) return true;
  if (!isTeacher(user)) return true;
  return !!db.prepare('SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND subject = ?').get(user.id, subject);
}

// Orang tua hanya boleh mengunggah bukti untuk tagihan anaknya.
function isChildOf(user, studentId) {
  return !!db.prepare('SELECT 1 FROM parent_students WHERE parent_id = ? AND student_id = ?').get(user.id, studentId);
}

module.exports = {
  getRoles,
  hasRole,
  hasAnyRole,
  isTeacher,
  hasFullAccess,
  studentScope,
  gradeScope,
  attendanceScope,
  billingScope,
  canManageStudent,
  canManageSubject,
  isChildOf
};
