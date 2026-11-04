const bcrypt = require('bcryptjs');

require('dotenv').config();

const sequelize = require('../config/database');
const { Student, Teacher, Parent, Class } = require('../models');

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'Password123';
 
const ACCOUNTS = {
    admin: {
        email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
        password: DEFAULT_PASSWORD,
        name: process.env.SEED_ADMIN_NAME || 'Admin Seed',
        nip: process.env.SEED_ADMIN_NIP || 'NIP-ADMIN-001',
        phone: process.env.SEED_ADMIN_PHONE || '081234560000',
        address: process.env.SEED_ADMIN_ADDRESS || 'Jl. Seed Admin',
    },
    teacher: {
        email: process.env.SEED_TEACHER_EMAIL || 'teacher@example.com',
        password: DEFAULT_PASSWORD,
        name: process.env.SEED_TEACHER_NAME || 'Teacher Seed',
        nip: process.env.SEED_TEACHER_NIP || 'NIP-TEACHER-001',
        phone: process.env.SEED_TEACHER_PHONE || '081234567890',
        address: process.env.SEED_TEACHER_ADDRESS || 'Jl. Seed Teacher',
    },
    parent: {
        email: process.env.SEED_PARENT_EMAIL || 'parent@example.com',
        password: DEFAULT_PASSWORD,
        name: process.env.SEED_PARENT_NAME || 'Parent Seed',
        phone: process.env.SEED_PARENT_PHONE || '081234567891',
    },
    student: {
        email: process.env.SEED_STUDENT_EMAIL || 'student@example.com',
        password: DEFAULT_PASSWORD,
        name: process.env.SEED_STUDENT_NAME || 'Student Seed',
        nis: process.env.SEED_STUDENT_NIS || 'NIS-001',
    },
};

function pickFirstClassIdOrCreate() {
    return (async () => {
        let classRow = await Class.findOne();
        if (classRow) return classRow.id;

        // Kalau belum ada data classes sama sekali, buat minimal satu.
        classRow = await Class.create({
            name: 'XII RPL 1',
            grade_level: 12,
            major: 'RPL',
        });

        return classRow.id;
    })();
}

async function ensureUser() {
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // TEACHER
    const teacher = await Teacher.findOne({ where: { email: ACCOUNTS.teacher.email } });
    if (!teacher) {
        await Teacher.create({
            name: ACCOUNTS.teacher.name,
            email: ACCOUNTS.teacher.email,
            password: hashedPassword,
            nip: ACCOUNTS.teacher.nip,
            phone: ACCOUNTS.teacher.phone,
            address: ACCOUNTS.teacher.address,
        });
        console.log(`[OK] Seed teacher: ${ACCOUNTS.teacher.email}`);
    } else {
        console.log(`[SKIP] Teacher already exists: ${ACCOUNTS.teacher.email}`);
    }

    // ADMIN (stored as a Teacher entry, distinguished by admin email)
    const admin = await Teacher.findOne({ where: { email: ACCOUNTS.admin.email } });
    if (!admin) {
        await Teacher.create({
            name: ACCOUNTS.admin.name,
            email: ACCOUNTS.admin.email,
            password: hashedPassword,
            nip: ACCOUNTS.admin.nip,
            phone: ACCOUNTS.admin.phone,
            address: ACCOUNTS.admin.address,
        });
        console.log(`[OK] Seed admin (teacher): ${ACCOUNTS.admin.email}`);
    } else {
        console.log(`[SKIP] Admin already exists: ${ACCOUNTS.admin.email}`);
    }

    // PARENT
    const parent = await Parent.findOne({ where: { email: ACCOUNTS.parent.email } });
    if (!parent) {
        await Parent.create({
            name: ACCOUNTS.parent.name,
            email: ACCOUNTS.parent.email,
            password: hashedPassword,
            phone: ACCOUNTS.parent.phone,
        });
        console.log(`[OK] Seed parent: ${ACCOUNTS.parent.email}`);
    } else {
        console.log(`[SKIP] Parent already exists: ${ACCOUNTS.parent.email}`);
    }

    const parentRow = await Parent.findOne({ where: { email: ACCOUNTS.parent.email } });

    // STUDENT
    // Controller register butuh nis. Model juga punya foreign key class_id & parent_id.
    // Pastikan ada class_id yang valid.
    const classId = await pickFirstClassIdOrCreate();

    const existingStudent = await Student.findOne({ where: { email: ACCOUNTS.student.email } });
    if (!existingStudent) {
        await Student.create({
            name: ACCOUNTS.student.name,
            email: ACCOUNTS.student.email,
            password: hashedPassword,
            nis: ACCOUNTS.student.nis,
            class_id: classId,
            parent_id: parentRow?.id || null,
        });
        console.log(`[OK] Seed student: ${ACCOUNTS.student.email}`);
    } else {
        console.log(`[SKIP] Student already exists: ${ACCOUNTS.student.email}`);
    }

    console.log('\n=== READY FOR LOGIN ===');
    console.log(`Teacher -> email: ${ACCOUNTS.teacher.email}, password: ${DEFAULT_PASSWORD}`);
    console.log(`Parent  -> email: ${ACCOUNTS.parent.email}, password: ${DEFAULT_PASSWORD}`);
    console.log(`Student -> email: ${ACCOUNTS.student.email}, password: ${DEFAULT_PASSWORD}`);
}

async function main() {
    try {
        await ensureUser();
    } catch (err) {
        console.error('[SEED USERS FAILED]', err);
        process.exitCode = 1;
    } finally {
        try {
            await sequelize.close();
        } catch (_) { }
    }
}

main();

