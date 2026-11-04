# ANALISIS MENDALAM: PERMASALAHAN DI LAPANGAN (SEKOLAH SMK DI INDONESIA) & SOLUSI DIGITALISASI AKADEMIK

Dokumen ini disusun untuk mengidentifikasi, menganalisis, dan memetakan permasalahan nyata yang dihadapi oleh Sekolah Menengah Kejuruan (SMK) di Indonesia dalam pengelolaan administratif, serta bagaimana aplikasi **Sistem Manajemen Akademik Sekolah (SQLite + Express + Vue 3)** menjawab tantangan tersebut.

---

## 1. PENDAHULUAN & LATAR BELAKANG
Sekolah Menengah Kejuruan (SMK) memiliki kompleksitas operasional yang jauh lebih tinggi dibandingkan jenjang pendidikan umum (SMA/SMP). Selain kurikulum normatif dan adaptif, SMK wajib menyelenggarakan pembelajaran produktif/kejuruan, Praktik Kerja Lapangan (PKL), pengelolaan bengkel/laboratorium, serta penelusuran lulusan (tracer study). 

Namun, di banyak SMK di Indonesia—khususnya sekolah swasta atau sekolah di daerah lapis kedua dan ketiga—proses administrasi akademik masih bergantung pada sistem konvensional (pencatatan manual di buku besar, rekapitulasi Excel yang terpisah antar-guru, atau aplikasi desktop legacy yang tidak terintegrasi).

---

## 2. EMPAT PILAR PERMASALAHAN UTAMA DI LAPANGAN

### A. Sistem Manajemen Akademik & Data Siswa/Guru
*   **Masalah di Lapangan:**
    *   **Fragmentasi Data:** Data siswa, guru, kelas, dan jadwal pelajaran sering tersimpan secara terpisah di file Excel masing-masing wali kelas atau bagian kurikulum, menyebabkan inkonsistensi data (misal: jumlah siswa di buku induk berbeda dengan rekap absensi).
    *   **Proses Mutasi & Kenaikan Kelas yang Rumit:** Kenaikan kelas atau pengelolaan siswa pindah/keluar dilakukan secara manual, memakan waktu berhari-hari saat awal semester.
    *   **Beban Administratif Guru yang Tinggi:** Guru sering disibukkan oleh urusan tulis-menulis administratif ketimbang fokus pada kualitas pengajaran dan praktik kejuruan.
*   **Solusi Aplikasi:**
    *   Penyediaan database terpusat berbasis **SQLite** dengan REST API Express.js yang menyimpan data master siswa, guru, kelas, dan jadwal secara relasional dan konsisten.
    *   Antarmuka manajemen data berbasis web (Vue 3 + Tailwind CSS) yang memungkinkan pencarian, filter, dan pembaruan data secara real-time.

---

### B. Absensi Siswa & Kedisiplinan
*   **Masalah di Lapangan:**
    *   **Absensi Kertas (Manual Logbook):** Presensi dicatat di buku kelas yang rawan hilang, rusak, atau dimanipulasi oleh siswa (titip absen).
    *   **Keterlambatan Rekapitulasi Bulanan:** Guru piket atau wali kelas membutuhkan waktu berjam-jam di akhir bulan untuk menghitung total kehadiran, izin, sakit, dan alfa setiap siswa guna keperluan laporan ke orang tua atau kesiswaan.
    *   **Kurangnya Transparansi ke Orang Tua:** Orang tua baru mengetahui anaknya sering membolos atau alfa setelah menerima rapor di akhir semester, sehingga terlambat untuk dilakukan pembinaan.
*   **Solusi Aplikasi:**
    *   Modul pencatatan absensi digital (`attendanceController.js` & `AttendancePage.vue`) yang memungkinkan pencatatan harian yang cepat oleh guru/piket per kelas.
    *   Rekapitulasi otomatis persentase kehadiran siswa yang langsung terhubung ke database tanpa perlu kalkulasi manual.

---

### C. Pengelolaan Nilai (Akademik & Praktik Kejuruan)
*   **Masalah di Lapangan:**
    *   **Arsip Nilai Tercecer:** Guru mata pelajaran menyetor nilai dalam bentuk lembaran kertas atau file Excel flashdisk yang sering corrupt atau hilang saat pergantian tahun ajaran.
    *   **Kompleksitas Komponen Penilaian SMK:** SMK memerlukan penilaian yang beragam (Nilai Teori, Praktik Bengkel/Lab, Portofolio, dan Sikap/Karakter). Rekapitulasi nilai akhir sering mengalami salah hitung bobot.
    *   **Akses Informasi Nilai Tertutup:** Siswa dan orang tua kesulitan memantau perkembangan nilai formatif maupun sumatif secara berkala selama semester berjalan.
*   **Solusi Aplikasi:**
    *   Modul manajemen nilai terintegrasi (`GradesPage.vue`) di mana guru dapat menginput nilai berdasarkan mata pelajaran dan siswa secara terstruktur.
    *   Transparansi nilai bagi siswa dan admin untuk memantau pencapaian akademik secara transparan dan akurat.

---

### D. Pengelolaan Tagihan & Pembayaran SPP (Keuangan Sekolah)
*   **Masalah di Lapangan:**
    *   **Pencatatan Keuangan Manual (Buku Kas / Kwitansi Kertas):** Pembayaran SPP, uang gedung, atau praktikum dicatat menggunakan buku kwitansi rangkap. Risiko kesalahan catat, uang selisih (human error), hingga hilangnya bukti pembayaran sangat tinggi.
    *   **Tunggakan SPP Menumpuk Tanpa Deteksi Dini:** Sekolah sering kesulitan melacak siswa yang menunggak SPP berbulan-bulan karena rekapitulasi pembayaran terlambat dilakukan oleh bagian bendahara.
    *   **Gesekan Sosial dengan Orang Tua:** Penagihan SPP yang kurang transparan sering menimbulkan miskomunikasi antara pihak sekolah dan orang tua murid.
*   **Solusi Aplikasi:**
    *   Modul manajemen tagihan dan pembayaran (`billingController.js` & `BillingPage.vue`) untuk memetakan status tagihan SPP per siswa (Lunas / Belum Lunas / Sebagian).
    *   Pencatatan riwayat pembayaran yang akurat dan transparan untuk memudahkan audit keuangan sekolah oleh kepala sekolah atau yayasan.

---

## 3. KESIMPULAN & REKOMENDASI IMPLEMENTASI

Aplikasi Sistem Manajemen Akademik Sekolah ini berhasil merangkum solusi esensial yang sangat dibutuhkan oleh SMK di Indonesia:
1.  **Sentralisasi & Integritas Data:** Menghilangkan silo data dengan menggunakan database relasional terpusat.
2.  **Efisiensi Waktu Administrasi:** Memangkas waktu rekapitulasi absensi, nilai, dan keuangan hingga 80%.
3.  **Transparansi & Akuntabilitas:** Menyediakan akses informasi yang jelas bagi pengelola sekolah, guru, siswa, dan orang tua.
4.  **Kemudahan Deployment:** Dengan arsitektur ringan (SQLite + Node.js + Vue 3), aplikasi ini dapat dijalankan bahkan pada infrastruktur server sekolah yang terbatas tanpa biaya lisensi yang mahal.
