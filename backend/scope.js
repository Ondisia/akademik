// Aturan pembatasan data per peran, dipakai bersama oleh route siswa,
// nilai, absensi, dan tagihan.
const db = require('./database');

const TEACHER_ROLES = ['guru_mapel', 'guru'];
const isTeacher = (user) => TEACHER_ROLES.includes(user.role);

// Klausa pada tabel students (kolom id/class).
function studentScope(user) {
  if (user.role === 'siswa') return { sql: 'id = ?', params: [user.id] };
  if (user.role === 'orang_tua') {
    return {
      sql: 'id IN (SELECT student_id FROM parent_students WHERE parent_id = ?)',
      params: [user.id]
    };
  }
  if (user.role === 'wali_kelas') {
    return user.class ? { sql: 'class = ?', params: [user.class] } : { sql: '1 = 0', params: [] };
  }
  if (isTeacher(user)) {
    return {
      sql: 'class IN (SELECT class FROM teacher_assignments WHERE teacher_id = ?)',
      params: [user.id]
    };
  }
  return { sql: '1 = 1', params: [] };
}

// Klausa pada tabel yang punya kolom student_id (grades, attendances, bills).
function recordScope(user, column = 'student_id') {
  if (user.role === 'siswa') return { sql: `${column} = ?`, params: [user.id] };
  if (user.role === 'orang_tua') {
    return {
      sql: `${column} IN (SELECT student_id FROM parent_students WHERE parent_id = ?)`,
      params: [user.id]
    };
  }
  if (user.role === 'wali_kelas') {
    return user.class
      ? { sql: `${column} IN (SELECT id FROM students WHERE class = ?)`, params: [user.class] }
      : { sql: '1 = 0', params: [] };
  }
  if (isTeacher(user)) {
    return {
      sql: `${column} IN (SELECT id FROM students WHERE class IN (SELECT class FROM teacher_assignments WHERE teacher_id = ?))`,
      params: [user.id]
    };
  }
  return { sql: '1 = 1', params: [] };
}

// Guru hanya boleh menulis nilai/absensi siswa di kelas dan mapel yang diampu.
// Wali kelas hanya untuk kelasnya. Peran lain (admin/pimpinan/TU) tidak dibatasi.
function canManageStudent(user, studentId, subject) {
  if (user.role === 'wali_kelas') {
    return !!db.prepare('SELECT 1 FROM students WHERE id = ? AND class = ?').get(studentId, user.class);
  }
  if (!isTeacher(user)) return true;
  const sql = `SELECT 1 FROM teacher_assignments ta JOIN students s ON s.class = ta.class
    WHERE ta.teacher_id = ? AND s.id = ?${subject ? ' AND ta.subject = ?' : ''}`;
  const params = subject ? [user.id, studentId, subject] : [user.id, studentId];
  return !!db.prepare(sql).get(...params);
}

// Guru mapel hanya boleh mengubah nilai pada mapel yang diampu.
function canManageSubject(user, subject) {
  if (!isTeacher(user)) return true;
  return !!db.prepare('SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND subject = ?').get(user.id, subject);
}

// Orang tua hanya boleh mengunggah bukti untuk tagihan anaknya.
function isChildOf(user, studentId) {
  return !!db.prepare('SELECT 1 FROM parent_students WHERE parent_id = ? AND student_id = ?').get(user.id, studentId);
}

module.exports = { isTeacher, studentScope, recordScope, canManageStudent, canManageSubject, isChildOf };
