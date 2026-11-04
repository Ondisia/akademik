# 📘 Frontend Academic System - Requirements

## 1. Overview

Aplikasi ini adalah sistem akademik sekolah berbasis web yang digunakan oleh:

* Admin
* Guru
* Siswa
* Orang Tua

Aplikasi menggunakan backend API dan tidak lagi mengandalkan mock data lokal. Struktur harus siap untuk integrasi sistem nyata.

---

## 2. Tech Stack

* Vue.js 3 (Composition API)
* Vite
* TypeScript (strict mode)
* Tailwind CSS
* Vue Router
* Pinia (State Management)

---

## 3. Core Features

### 3.1 Authentication (UI Only)

* Login page (email & password)
* Role-based access:

  * admin
  * guru
  * siswa
  * orang_tua
* Simulasi login menggunakan mock data
* Persist login menggunakan localStorage
* Route protection menggunakan navigation guards

---

### 3.2 Dashboard

* Menampilkan ringkasan:

  * Jumlah siswa
  * Jumlah guru
  * Absensi hari ini
* Menampilkan pengumuman terbaru
* Layout responsive (grid/card)

---

### 3.3 Students Management

* Menampilkan daftar siswa (table)
* Fitur:

  * search
  * filter
  * pagination (client-side)
* CRUD UI (tambah, edit, hapus)
* Form dalam modal
* Validasi input sederhana

---

### 3.4 Teachers Management

* Sama seperti Students:

  * Table list
  * CRUD UI
  * Search & pagination

---

### 3.5 Schedule Management

* Tabel jadwal pelajaran
* Format:

  * Hari vs Jam
  * Mapel, guru, kelas

---

### 3.6 Attendance

* List siswa per kelas
* Status:

  * hadir
  * izin
  * alfa
* Disimpan di state lokal (Pinia)

---

### 3.7 Grades & Report

* Input nilai siswa
* Table nilai
* Tampilan rapor sederhana

---

### 3.8 Announcements

* List pengumuman
* Detail pengumuman
* Tambah pengumuman (admin/guru)

---

### 3.9 Communication

* UI chat sederhana
* Contact list
* Message thread
* Tanpa realtime (mock)

---

### 3.10 Payment (Optional)

* Status pembayaran
* Histori pembayaran

---

## 4. UI/UX Requirements

* Desain modern & clean
* Responsive (mobile-first)
* Konsistensi spacing & typography
* Gunakan Tailwind utility classes
* Tambahkan:

  * Loading state
  * Empty state
  * Error fallback UI

---

## 5. Architecture

### 5.1 Folder Structure

src/
assets/
components/
ui/
layout/
features/
auth/
students/
teachers/
schedule/
attendance/
grades/
announcements/
communication/
router/
stores/
composables/
types/
data/

---

### 5.2 Component Rules

* Gunakan reusable components
* Hindari duplikasi kode (DRY)
* Pisahkan logic ke composables

---

### 5.3 State Management

* Gunakan Pinia
* Pisahkan store per fitur
* Gunakan state, getters, actions dengan jelas

---

## 6. Data Handling

* Gunakan backend API, bukan mock JSON lokal
* Tidak boleh hardcode langsung di component
* Siapkan struktur seolah-olah dari API

---

## 7. Code Quality Standards

* Gunakan TypeScript tanpa `any`
* Gunakan interface/type untuk semua data
* Gunakan optional chaining (?.)
* Validasi input form
* Hindari undefined/null error

---

## 8. Routing

* Gunakan Vue Router
* Gunakan navigation guards untuk proteksi route
* Pisahkan route berdasarkan fitur

---

## 9. Error Handling

* Tangani semua kemungkinan error:

  * data kosong
  * undefined
  * invalid input
* Gunakan fallback UI

---

## 10. Deliverables

* Struktur project lengkap
* Minimal:

  * 1 halaman Dashboard
  * 1 reusable component
  * 1 Pinia store
  * 1 composable
* Backend API integration ready
* Bisa dijalankan dengan:
  npm install
  npm run dev

---

## 11. Future Ready

* Struktur siap integrasi backend API
* Mudah dikembangkan (scalable)
* Clean dan maintainable
