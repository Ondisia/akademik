const { Attendance, Student, Schedule } = require('../models');

exports.getAllAttendances = async (req, res, next) => {
  try {
    let where = {};
    if (req.userRole === 'student') {
      where.student_id = req.user.id;
    } else if (req.userRole === 'parent') {
      const students = await Student.findAll({ where: { parent_id: req.user.id } });
      where.student_id = students.map(s => s.id);
    }
    const attendances = await Attendance.findAll({ where, include: [Student, Schedule] });
    res.json({ success: true, data: attendances });
  } catch (err) { next(err); }
};

exports.getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [Student, Schedule]
    });
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
};

exports.createAttendance = async (req, res, next) => {
  try {
    const { student_id, schedule_id, date, status, reason } = req.body;
    
    // Validasi input wajib
    if (!student_id || !schedule_id || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'student_id, schedule_id, dan status harus diisi' 
      });
    }

    // Verifikasi schedule ada dan milik guru (untuk teacher)
    if (req.userRole === 'teacher') {
      const schedule = await Schedule.findByPk(schedule_id);
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
      }
      if (schedule.teacher_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Anda tidak berhak mengelola jadwal ini' });
      }
    }

    const attendance = await Attendance.create({
      student_id,
      schedule_id,
      date: date || new Date(),
      status,
      reason: reason || null
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (err) { next(err); }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, { include: [Schedule] });
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    
    // Verifikasi guru punya akses (ownership check)
    if (req.userRole === 'teacher') {
      if (attendance.Schedule.teacher_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Anda tidak berhak mengubah absensi ini' });
      }
    }

    await attendance.update(req.body);
    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
};

exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    await attendance.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
};