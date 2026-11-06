// Smoke test role/permission matrix. Run: node smoke-roles.mjs
const BASE = 'http://localhost:3000/api';

async function login(email, password) {  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`login ${email} failed: ${r.status} ${JSON.stringify(j)}`);
  return j.token;
}

async function req(token, method, path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let j = null;
  try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
}

const users = {
  admin: ['admin@example.com', 'Password123'],
  kepsek: ['kepsek@smk.id', 'Password123'],
  waka: ['waka@smk.id', 'Password123'],
  wali1: ['wali1@smk.id', 'Password123'],
  guru1: ['guru1@smk.id', 'Password123'],
  kepalatu: ['kepalatu@smk.id', 'Password123'],
  stafftu: ['stafftu@smk.id', 'Password123'],
  siswa: ['siswa@smk.id', 'siswa123'],
  ortu: ['ortu@smk.id', 'ortu123'],
};

const tokens = {};
for (const [k, [e, p]] of Object.entries(users)) {
  try { tokens[k] = await login(e, p); } catch (err) { console.log(`LOGIN FAIL ${k}: ${err.message}`); }
}

const results = [];
function check(name, actual, expected) {
  const ok = actual === expected;
  results.push({ name, actual, expected, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${actual} (expected ${expected})`);
}

// helpers
async function status(who, method, path, body) {
  return (await req(tokens[who], method, path, body)).status;
}

// Tagihan / billings
check('guru_mapel GET /bills = 403', await status('guru1', 'GET', '/bills'), 403);
check('wali_kelas GET /bills = 200', await status('wali1', 'GET', '/bills'), 200);
check('wali_kelas POST /bills = 403', await status('wali1', 'POST', '/bills', { studentId: 'x', amount: 1, dueDate: '2026-01-01' }), 403);
check('kepala_tu GET /bills = 200', await status('kepalatu', 'GET', '/bills'), 200);
check('staff_tu GET /bills = 200', await status('stafftu', 'GET', '/bills'), 200);
check('kepala_sekolah GET /bills = 200', await status('kepsek', 'GET', '/bills'), 200);

// Students read
check('guru_mapel GET /students = 200', await status('guru1', 'GET', '/students'), 200);
check('wali_kelas GET /students = 200', await status('wali1', 'GET', '/students'), 200);
check('siswa GET /students = 200', await status('siswa', 'GET', '/students'), 200);

// Students write
check('wali_kelas POST /students = 403', await status('wali1', 'POST', '/students', { name: 'x', niup: 'x', gender: 'L', class: 'X RPL 1' }), 403);
check('staff_tu POST /students = 201/200', [200, 201].includes(await status('stafftu', 'POST', '/students', { name: 'Smoke Test', niup: 'SMOKE-' + Date.now(), gender: 'L', class: 'X RPL 1' })), true);

// Ekskul write
check('guru_mapel POST /ekskul = 403', await status('guru1', 'POST', '/ekskul', { name: 'x' }), 403);
check('waka POST /ekskul = 201/200', [200, 201].includes(await status('waka', 'POST', '/ekskul', { nama: 'Smoke Ekskul', deskripsi: 'x' })), true);

// Grades read scoping
const waliGrades = await req(tokens.wali1, 'GET', '/grades');
check('wali_kelas GET /grades = 200', waliGrades.status, 200);
const guruGrades = await req(tokens.guru1, 'GET', '/grades');
check('guru_mapel GET /grades = 200', guruGrades.status, 200);
check('siswa GET /grades = 200', (await status('siswa', 'GET', '/grades')), 200);

// Attendance read
check('wali_kelas GET /attendances = 200', await status('wali1', 'GET', '/attendances'), 200);
check('siswa GET /attendances = 200', await status('siswa', 'GET', '/attendances'), 200);
check('guru_mapel POST /attendances = not 403', (await status('guru1', 'POST', '/attendances', {})) !== 403, true);

// Teachers
check('wali_kelas GET /teachers = 200', await status('wali1', 'GET', '/teachers'), 200);
check('wali_kelas POST /teachers = 403', await status('wali1', 'POST', '/teachers', { name: 'x', niup: 'x', gender: 'L' }), 403);

// Data scoping (core of this feature)
const waliStudents = await req(tokens.wali1, 'GET', '/students');
const waliClasses = [...new Set((waliStudents.body || []).map((s) => s.class))];
check('wali_kelas /students only own class', waliClasses.length <= 1 && (waliClasses[0] === 'X RPL 1' || waliStudents.body.length === 0), true);

const siswaStudents = await req(tokens.siswa, 'GET', '/students');
check('siswa /students only self', (siswaStudents.body || []).length <= 1, true);

const guruBills = await req(tokens.guru1, 'GET', '/bills');
check('guru_mapel /bills body has no data', guruBills.status === 403 && !Array.isArray(guruBills.body), true);

const waliGradesScopedRes = await req(tokens.wali1, 'GET', '/grades');
const waliStudentIds = new Set((waliStudents.body || []).map((s) => s.id));
const waliGradesScoped = (waliGradesScopedRes.body || []).every((g) => waliStudentIds.has(g.studentId));
check('wali_kelas /grades only own class', waliGradesScoped, true);

// Relasi orang tua -> anak
const ortuStudents = await req(tokens.ortu, 'GET', '/students');
const ortuIds = (ortuStudents.body || []).map((s) => s.id).sort().join(',');
check('orang_tua /students hanya anak sendiri', ortuIds === 'std-001,std-002', true);

const ortuGrades = await req(tokens.ortu, 'GET', '/grades');
check('orang_tua /grades hanya anak sendiri', (ortuGrades.body || []).length > 0 && ortuGrades.body.every((g) => ['std-001', 'std-002'].includes(g.studentId)), true);

const ortuBills = await req(tokens.ortu, 'GET', '/bills');
check('orang_tua /bills hanya anak sendiri', (ortuBills.body || []).length > 0 && ortuBills.body.every((b) => ['std-001', 'std-002'].includes(b.student_id)), true);

const allBills = (await req(tokens.admin, 'GET', '/bills')).body;
const otherBill = allBills.find((b) => !['std-001', 'std-002'].includes(b.student_id));
check('orang_tua PUT tagihan anak lain = 403', (await req(tokens.ortu, 'PUT', `/bills/${otherBill.id}`, { paymentProof: 'data:image/png;base64,AA==', proofFilename: 'bukti.png' })).status, 403);
check('orang_tua PUT tagihan anak sendiri = 200', (await req(tokens.ortu, 'PUT', `/bills/${ortuBills.body[0].id}`, { paymentProof: 'data:image/png;base64,AA==', proofFilename: 'bukti.png' })).status, 200);

// Relasi guru -> mapel/kelas
const guruStudents = await req(tokens.guru1, 'GET', '/students');
check('guru_mapel /students hanya kelas yang diampu', (guruStudents.body || []).length > 0 && guruStudents.body.every((s) => s.class === 'X RPL 1'), true);

const guruGradesScoped = await req(tokens.guru1, 'GET', '/grades');
const taughtSubjects = new Set(['Informatika', 'Pemrograman Web']);
check('guru_mapel /grades hanya mapel yang diampu', (guruGradesScoped.body || []).length > 0 && guruGradesScoped.body.every((g) => taughtSubjects.has(g.subject)), true);

const xStudent = guruStudents.body[0];
const xiStudent = (await req(tokens.admin, 'GET', '/students')).body.find((s) => s.class === 'XI RPL 1');
const gradeBody = (student, subject) => ({ studentId: student.id, studentName: student.name, subject, score: 90, date: '2026-01-02' });
check('guru_mapel POST nilai mapel lain = 403', (await req(tokens.guru1, 'POST', '/grades', gradeBody(xStudent, 'Matematika'))).status, 403);
check('guru_mapel POST nilai kelas lain = 403', (await req(tokens.guru1, 'POST', '/grades', gradeBody(xiStudent, 'Informatika'))).status, 403);
const goodGrade = await req(tokens.guru1, 'POST', '/grades', gradeBody(xStudent, 'Informatika'));
check('guru_mapel POST nilai mapel sendiri = 201', goodGrade.status, 201);
if (goodGrade.body?.id) await req(tokens.admin, 'DELETE', `/grades/${goodGrade.body.id}`);

const attBody = (student) => ({ attendances: [{ studentId: student.id, studentName: student.name, date: '2030-01-01', status: 'hadir' }] });
check('guru_mapel POST absensi kelas lain = 403', (await req(tokens.guru1, 'POST', '/attendances', attBody(xiStudent))).status, 403);
check('guru_mapel POST absensi kelas sendiri = 201', (await req(tokens.guru1, 'POST', '/attendances', attBody(xStudent))).status, 201);
await req(tokens.admin, 'DELETE', `/attendances/att-${xStudent.id}-2030-01-01`);

// API relasi
check('wali_kelas GET /relations/parents = 403', (await req(tokens.wali1, 'GET', '/relations/parents')).status, 403);
check('admin GET relations = 200', (await req(tokens.admin, 'GET', '/relations/teacher-assignments')).status, 200);

const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) { console.log('FAILURES:', JSON.stringify(failed, null, 2)); process.exit(1); }
