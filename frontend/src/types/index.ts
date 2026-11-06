export type UserRole =
  | 'admin'
  | 'kepala_sekolah'
  | 'waka'
  | 'guru_mapel'
  | 'wali_kelas'
  | 'kepala_tu'
  | 'staff_tu'
  | 'guru'
  | 'siswa'
  | 'orang_tua'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Student {
  id: string
  name: string
  niup: string
  class: string
  status: 'siswa aktif' | 'siswa berhenti' | 'siswa lulus'
  gender: 'L' | 'P'
}

export interface Teacher {
  id: string
  name: string
  niup: string
  gender: 'L' | 'P'
  subjects: string[]
  classes: string[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  category: 'info' | 'warning' | 'urgent'
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: 'hadir' | 'izin' | 'alfa'
  note?: string
}

export interface Grade {
  id: string
  studentId: string
  studentName: string
  subject: string
  score: number
  date: string
}

export interface Schedule {
  id: string
  class: string
  time: string
  subject: string
  teacher: string
  room: string
}

export type BillingStatus = 'requested' | 'pending_verification' | 'paid' | 'rejected'

export interface Bill {
  id: string
  studentId: string
  studentName: string
  amount: number
  period: string
  description?: string
  status: BillingStatus
  paymentProof?: string | null
  proofFilename?: string | null
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: string
  name: string
  major?: string
  teacher: string
  capacity: number
}

export interface Ekskul {
  id: string
  nama: string
  pembina: string
  jadwal: string
  deskripsi: string
}

export interface Prestasi {
  id: string
  studentId: string
  siswa: string
  kelas: string
  kategori: string
  juara: string
  event: string
  tahun: string
}
