# UI/UX Audit — Sistem Akademik SMK

Audit dan perbaikan antarmuka frontend Vue 3 + Tailwind. Fokus: spacing, konsistensi, keterbacaan, target sentuh, dan perilaku mobile.

## 1. Dasar yang dipakai

Aturan di bawah diambil dari sumber publik, bukan selera.

| Prinsip | Aturan operasional | Sumber |
|---|---|---|
| 8pt grid | Semua padding, margin, gap, dan tinggi komponen memakai kelipatan 4/8 px: 4, 8, 12, 16, 24, 32, 40, 48. Tidak ada nilai acak seperti 7px, 13px, 30px. Material 3 memakai skala 8dp (`space100 = 8dp`) dan menyesuaikan nilai per breakpoint. | Material Design 3 — Spacing (m3.material.io/styles/spacing/overview) |
| Internal ≤ external | Jarak di dalam komponen (padding) tidak boleh lebih besar dari jarak antar komponen. Kalau padding kartu 24px, jarak antar kartu minimal 24px. Ini hukum proximity (Gestalt). | Cieden — Spacing best practices (cieden.com/book/sub-atomic/spacing/spacing-best-practices); NN/g — Form Design: White Space |
| Proximity | Label menempel ke input-nya (8px), jarak antar field lebih besar (16–24px). Elemen yang berhubungan didekatkan; yang tidak berhubungan dijauhkan. | NN/g — Form Design Quick Fix: Group Form Elements Effectively Using White Space |
| Target sentuh | Minimum 24×24 CSS px (WCAG 2.2 SC 2.5.8, level AA). Untuk aksi utama di mobile, target 44×44 px. Link teks kecil harus punya padding atau jarak agar tidak bertabrakan. | W3C WAI — Understanding SC 2.5.8 Target Size (Minimum) |
| Ritme vertikal | Jarak antar section lebih besar dari jarak antar elemen di dalam section. Heading menempel ke kontennya, bukan mengambang. | NN/g — Whitespace; Material 3 — Grids & spacing |
| Kepadatan responsif | Mobile lebih rapat (16px), desktop lebih lapang (24–32px). Satu skala, bukan dua desain. | Material 3 — Spacing (adaptive values per breakpoint) |

## 2. Skala spacing proyek

Nilai ini wajib dipakai konsisten.

| Konteks | Mobile | ≥ sm (640px) | ≥ lg (1024px) |
|---|---|---|---|
| Padding konten halaman | 16px (`p-4`) | 24px (`p-6`) | 32px (`p-8`) |
| Padding header bar | 16px (`px-4`) | 24px (`px-6`) | 32px (`px-8`) |
| Padding kartu | 16px (`p-4`) | 24px (`p-6`) | 24px (`p-6`) |
| Gap grid kartu | 16px (`gap-4`) | 24px (`gap-6`) | 24px (`gap-6`) |
| Jarak antar section | 24px (`space-y-6`) | 24px | 32px (`space-y-8`) |
| Sel tabel horizontal | 16px (`px-4`) | 24px (`px-6`) | 32px (`px-8`) |
| Sel tabel vertikal | 12px (`py-3`) | 16px (`py-4`) | 16px (`py-4`) |
| Label ke input | 6px (`mb-1.5`, sudah ada) | sama | sama |
| Antar field form | 16px (`gap-4`) | 24px (`gap-6`) | 24px |

## 3. Aturan implementasi

1. Jangan menambah dependency. Jangan mengubah backend.
2. Jangan mengganti struktur halaman, teks, atau alur. Perbaikan bersifat visual dan aksesibilitas.
3. Jangan memakai nilai arbitrary Tailwind (`p-[18px]`, `gap-[13px]`) kecuali sudah ada dan tidak bisa diganti.
4. Radius kartu diseragamkan ke token yang sudah ada: `rounded-card` (12px) untuk kartu, `rounded-button` (8px) untuk kontrol, `rounded-modal` (16px) untuk dialog. Hapus pemakaian `rounded-[32px]`.
5. Kelas yang dipakai tetapi tidak didefinisikan adalah cacat. `premium-card` dipakai di 4 halaman tetapi tidak ada di `index.css`; wajib didefinisikan atau diganti.
6. Tabel lebar di mobile harus punya pembungkus `overflow-x-auto` dan isyarat visual bahwa isinya bisa digeser. Jangan memaksa kolom mengecil sampai teks terpotong.
7. Tombol ikon minimal 32×32 px; link teks kecil minimal 24px tinggi efektif (padding atau `py-1.5`).
8. Angka dan teks panjang di kartu memakai `tabular-nums` dan `truncate`/`min-w-0` agar tidak mendorong layout.
9. Kontras teks minimal 4.5:1 untuk teks normal. `text-slate-400` di atas putih (2.6:1) hanya boleh untuk dekorasi, bukan informasi.
10. Setiap halaman harus tetap terbaca pada lebar 360px tanpa scroll horizontal pada `body`.

## 4. Metode audit

- Inspeksi statis seluruh `frontend/src/features/**` dan `frontend/src/components/**`.
- Pengukuran runtime di Chrome: lebar 1440×900, 768×1024, dan 390×844.
- Pemeriksaan: overflow horizontal, tinggi target sentuh, kontras, konsistensi padding, dan hierarki jarak.
- Verifikasi akhir: `npm run build`, pengecekan halaman, dan stress test API.

## 5. Temuan dan perbaikan

Diisi setelah audit dan perbaikan selesai.
