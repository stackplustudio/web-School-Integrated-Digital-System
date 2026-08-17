# Product Requirements Document (PRD)
# School Integrated Digital System (SIDS)

| | |
|---|---|
| **Nama Produk** | (Working Title) — *SmartSchool* / *EduCore* / *SchoolOne* *(ganti sesuai nama brand)* |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 5 Juli 2026 |
| **Cakupan Modul** | PPDB, Academic Management, LMS, Presensi, Keuangan/SPP (dasar) |
| **Skala Penggunaan** | Single sekolah (1 institusi) |
| **Platform** | Web App (semua role mengakses via browser) |
| **Status** | Draft untuk pengembangan |

---

## 1. Latar Belakang & Ringkasan Eksekutif

### 1.1 Latar Belakang
Banyak sekolah — negeri maupun swasta — masih mengelola proses inti secara terfragmentasi:

- **PPDB (Penerimaan Peserta Didik Baru)** dilakukan manual (formulir kertas/Excel/Google Form terpisah), menyulitkan seleksi, verifikasi berkas, dan pengumuman hasil.
- **Nilai & rapor** dicatat guru di kertas/Excel masing-masing, sulit direkap wali kelas dan rawan human error saat penggabungan nilai akhir.
- **Presensi siswa** dicatat manual per kelas, sulit dipantau orang tua secara real-time, dan rekap bulanan memakan waktu.
- **Pembelajaran (materi, tugas)** masih mengandalkan grup WhatsApp atau platform pihak ketiga terpisah-pisah (Google Classroom, dsb.) yang tidak terhubung dengan data akademik resmi sekolah.
- **Pembayaran SPP** dicatat manual oleh bendahara, sulit memantau tunggakan dan mengirim pengingat ke orang tua.
- Data siswa tersebar di banyak sistem/file berbeda yang tidak saling terhubung, menyulitkan pelaporan ke Dinas Pendidikan/Yayasan.

### 1.2 Solusi
**School Integrated Digital System (SIDS)** adalah platform terpadu berbasis web yang menyatukan seluruh siklus siswa dalam satu sistem:

1. **PPDB** — pendaftaran online, seleksi, pengumuman, hingga daftar ulang menjadi siswa aktif.
2. **Academic Management** — manajemen tahun ajaran, kelas, mata pelajaran, jadwal, input nilai, ujian, hingga cetak rapor.
3. **LMS (Learning Management System)** — distribusi materi ajar, penugasan, pengumpulan tugas online, dan penilaian tugas terintegrasi dengan nilai akademik.
4. **Presensi** — pencatatan kehadiran siswa harian/per mata pelajaran dengan visibilitas real-time untuk orang tua.
5. **Keuangan/SPP (dasar)** — tagihan SPP bulanan, pencatatan pembayaran, dan laporan tunggakan.

Karena data siswa yang masuk lewat PPDB otomatis menjadi data akademik siswa aktif (tanpa entri ulang), dan nilai LMS otomatis terhubung ke nilai akademik, sekolah mendapat **satu sumber data siswa yang konsisten** dari pendaftaran hingga kelulusan.

### 1.3 Model Penggunaan
- Digunakan oleh **1 institusi sekolah** (bukan SaaS multi-tenant di V1), namun arsitektur tetap dirancang modular agar dapat diadaptasi ke sekolah lain sebagai deployment terpisah di kemudian hari.

---

## 2. Tujuan Produk (Goals & Objectives)

### 2.1 Tujuan Bisnis/Institusi
1. Mendigitalisasi seluruh proses inti sekolah dalam satu platform terintegrasi, mengurangi duplikasi entri data.
2. Meningkatkan transparansi informasi akademik & keuangan kepada orang tua secara real-time.
3. Mempercepat proses PPDB dan pengolahan nilai/rapor yang selama ini memakan waktu manual berhari-hari.

### 2.2 Tujuan Produk
1. Calon siswa dapat mendaftar PPDB online dari awal hingga pengumuman kelulusan tanpa perlu datang ke sekolah (kecuali untuk verifikasi berkas fisik/daftar ulang jika diperlukan).
2. Guru dapat menginput nilai, tugas, dan presensi dalam satu sistem, dengan rapor yang ter-generate otomatis dari data tersebut (tanpa rekap ulang manual).
3. Orang tua dapat memantau kehadiran, nilai, tugas, dan status pembayaran SPP anaknya dalam satu dashboard.
4. Data siswa mengalir otomatis: PPDB (calon siswa) → Daftar Ulang → menjadi Data Siswa Aktif di modul Akademik, tanpa entri data ganda.

### 2.3 Success Metrics (KPI)
| Metrik | Target |
|---|---|
| Waktu proses PPDB (dari pendaftaran hingga pengumuman) | Berkurang ≥ 50% dibanding proses manual |
| Waktu rekap nilai akhir semester oleh wali kelas | Berkurang ≥ 70% |
| Tingkat keterlambatan pembayaran SPP | Turun ≥ 25% (berkat reminder otomatis) |
| Adopsi orang tua terhadap portal (login aktif bulanan) | > 70% dari total orang tua |
| Akurasi data presensi (dibanding rekap manual) | > 98% |
| Uptime sistem | ≥ 99.5% |

---

## 3. Target Pengguna & Persona

### 3.1 Segmen Target
- Sekolah jenjang SD/SMP/SMA/SMK (negeri/swasta) dengan populasi siswa 200–3.000 siswa per institusi.

### 3.2 Persona

**Persona 1 — Bu Wati (Kepala Sekolah)**
- Butuh gambaran menyeluruh: jumlah pendaftar PPDB, rata-rata nilai per kelas, tingkat kehadiran, dan status SPP sekolah — tanpa perlu tanya TU/bendahara satu-satu.

**Persona 2 — Pak Anton (Admin TU / Panitia PPDB)**
- Mengelola pendaftaran calon siswa baru, verifikasi berkas, proses seleksi, dan mengelola data siswa aktif setelah daftar ulang.

**Persona 3 — Bu Siti (Guru Mata Pelajaran & Wali Kelas)**
- Input materi & tugas di LMS, menilai tugas siswa, input nilai ujian, mencatat presensi harian kelasnya, dan mencetak rapor sebagai wali kelas.

**Persona 4 — Rian (Siswa)**
- Melihat jadwal pelajaran, mengakses materi & mengumpulkan tugas, melihat nilai dan presensi miliknya.

**Persona 5 — Pak Budi (Orang Tua/Wali Murid)**
- Memantau kehadiran, nilai, tugas, dan tagihan SPP anaknya; menerima notifikasi penting (nilai keluar, anak tidak hadir, tagihan jatuh tempo).

**Persona 6 — Bu Maya (Bendahara Sekolah)**
- Mengelola tagihan SPP bulanan, mencatat pembayaran, memantau tunggakan, dan membuat laporan keuangan sederhana untuk kepala sekolah/yayasan.

**Persona 7 — Admin Sistem (IT Sekolah)**
- Mengelola pengaturan tahun ajaran, struktur kelas/mapel, hak akses user, dan konfigurasi teknis sistem.

---

## 4. Peran Pengguna & Hak Akses (User Roles & Permissions)

| Role | Deskripsi |
|---|---|
| **Admin Sistem** | Akses penuh & tertinggi. Mengelola pengaturan sistem, tahun ajaran, struktur kelas/mapel, dan seluruh akun pengguna |
| **Kepala Sekolah** | Akses lihat menyeluruh (read-mostly) ke semua modul untuk monitoring & approval kebijakan tertentu (mis. pengumuman kelulusan PPDB) |
| **Admin TU / Panitia PPDB** | Mengelola proses PPDB dari pendaftaran hingga daftar ulang, serta administrasi data siswa aktif |
| **Guru Mata Pelajaran** | Mengelola materi/tugas LMS, input nilai, input presensi untuk mapel yang diampu |
| **Wali Kelas** | Guru dengan hak tambahan: melihat rekap nilai & presensi seluruh mapel di kelasnya, mengelola & mencetak rapor kelasnya |
| **Bendahara** | Mengelola tagihan SPP, pencatatan pembayaran, laporan keuangan siswa |
| **Siswa** | Mengakses LMS (materi, tugas), melihat nilai, presensi, dan jadwal miliknya sendiri |
| **Orang Tua/Wali Murid** | Memantau data anak (nilai, presensi, tugas, tagihan SPP), menerima notifikasi |

### 4.1 Matriks Hak Akses (RBAC Detail)

| Modul / Fitur | Admin Sistem | Kepsek | Admin TU | Guru | Wali Kelas | Bendahara | Siswa | Orang Tua |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Pengaturan tahun ajaran, kelas, mapel | ✅ | 🔶 (lihat) | 🔶 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kelola user & role | ✅ | ❌ | 🔶 (siswa/ortu) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kelola pendaftaran PPDB & seleksi | ❌ | 🔶 (approve) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Input materi & tugas LMS | ❌ | ❌ | ❌ | ✅ (mapelnya) | ✅ (mapelnya) | ❌ | ❌ | ❌ |
| Kumpulkan tugas & ikut kuis LMS | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Input nilai ujian/tugas | ❌ | ❌ | ❌ | ✅ (mapelnya) | ✅ (mapelnya) | ❌ | ❌ | ❌ |
| Rekap nilai & cetak rapor kelas | ❌ | 🔶 (lihat semua) | 🔶 (lihat semua) | ❌ | ✅ (kelasnya) | ❌ | 🔶 (lihat sendiri) | 🔶 (lihat anak) |
| Input presensi harian/per mapel | ❌ | ❌ | 🔶 | ✅ (mapelnya) | ✅ (kelasnya) | ❌ | ❌ | ❌ |
| Lihat rekap presensi | ❌ | ✅ | ✅ | 🔶 (mapelnya) | ✅ (kelasnya) | ❌ | ✅ (sendiri) | ✅ (anak) |
| Kelola tagihan SPP & pembayaran | ❌ | 🔶 (lihat laporan) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Lihat status tagihan/pembayaran sendiri | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | 🔶 | ✅ (anak) |
| Lihat dashboard laporan sekolah menyeluruh | 🔶 | ✅ | 🔶 | ❌ | ❌ | 🔶 (keuangan) | ❌ | ❌ |

Legenda: ✅ Full akses · 🔶 Akses terbatas/read-only · ❌ Tidak ada akses

---

## 5. Ruang Lingkup (Scope)

### 5.1 In-Scope (MVP)
**Modul PPDB:**
- Pendaftaran online calon siswa (formulir digital + upload berkas).
- Manajemen jalur pendaftaran (mis. reguler, prestasi, afirmasi) dengan kuota per jalur.
- Verifikasi berkas oleh Admin TU (status: Menunggu Verifikasi/Diterima/Ditolak/Perlu Revisi).
- Proses seleksi (input nilai seleksi/tes, ranking otomatis berdasarkan kriteria).
- Pengumuman hasil kelulusan online (per akun pendaftar).
- Daftar ulang online (konfirmasi + pembayaran biaya daftar ulang jika ada) yang otomatis membuat data siswa aktif di modul akademik.

**Modul Academic Management:**
- Manajemen tahun ajaran & semester.
- Manajemen struktur kelas, wali kelas, dan penempatan siswa per kelas.
- Manajemen mata pelajaran & pengampu (guru per mapel per kelas).
- Manajemen jadwal pelajaran per kelas.
- Input nilai (tugas, UH/Ulangan Harian, UTS, UAS) per mapel.
- Perhitungan nilai akhir/rapor berdasarkan bobot yang dikonfigurasi.
- Cetak rapor per siswa per semester (PDF).
- Kenaikan kelas (promosi siswa ke kelas/tahun ajaran berikutnya).

**Modul LMS:**
- Upload & distribusi materi ajar (dokumen, video link, dsb.) per mapel/kelas.
- Pemberian tugas dengan tenggat waktu, siswa mengumpulkan secara online (upload file/teks).
- Penilaian tugas oleh guru, otomatis masuk sebagai komponen nilai akademik.
- Kuis online sederhana (pilihan ganda/isian, penilaian otomatis untuk pilihan ganda).
- Forum diskusi/pengumuman per kelas/mapel (komunikasi guru-siswa).

**Modul Presensi:**
- Presensi harian (per kelas, oleh wali kelas) dan/atau per mata pelajaran (oleh guru mapel) — dapat dikonfigurasi sesuai kebijakan sekolah.
- Status kehadiran: Hadir, Izin, Sakit, Alpa, Terlambat.
- Rekap presensi per siswa/kelas/periode.
- Notifikasi otomatis ke orang tua saat anak tercatat tidak hadir tanpa keterangan.

**Modul Keuangan/SPP (Dasar):**
- Pembuatan tagihan SPP bulanan (dan biaya lain seperti uang gedung/kegiatan) per siswa/kelas.
- Pencatatan pembayaran (manual oleh bendahara berdasarkan bukti transfer, atau via integrasi payment gateway).
- Laporan tunggakan SPP per siswa/kelas.
- Riwayat pembayaran dapat dilihat orang tua.
- Reminder otomatis tagihan jatuh tempo/tunggakan.

**Umum:**
- Dashboard berbeda untuk tiap role sesuai kebutuhan informasinya.
- Notifikasi (in-app & email) untuk kejadian penting (pengumuman PPDB, nilai keluar, presensi alpa, tagihan jatuh tempo).

### 5.2 Out-of-Scope (Fase Berikutnya / Non-Goals di V1)
- Aplikasi mobile native (Android/iOS) — V1 berbasis web responsive untuk semua role.
- Modul HR/Payroll guru & staff secara penuh.
- Modul Perpustakaan digital & manajemen sarana-prasarana/inventaris.
- Multi-sekolah dalam 1 platform (mode yayasan/SaaS multi-tenant) — dicatat sebagai potensi ekspansi arsitektur di masa depan.
- Video conference terintegrasi untuk kelas online (dapat memakai link eksternal Zoom/Meet di modul LMS untuk V1).
- Ujian online dengan proktoring/anti-kecurangan tingkat lanjut.
- Modul akuntansi sekolah penuh (jurnal umum, neraca yayasan) — Keuangan V1 hanya sebatas SPP siswa.
- Integrasi dengan Dapodik/sistem pelaporan Dinas Pendidikan (kandidat fase 2 karena kompleksitas format & regulasi).

---

## 6. Functional Requirements (Kebutuhan Fungsional)

### 6.1 Modul: Autentikasi & Manajemen User
| ID | Requirement |
|---|---|
| FR-AUTH-01 | Login berbasis email/username + password untuk semua role |
| FR-AUTH-02 | Akun Siswa & Orang Tua dapat dibuat otomatis saat proses daftar ulang PPDB selesai (tanpa entri manual ulang) |
| FR-AUTH-03 | Admin Sistem dapat membuat/menonaktifkan akun Guru, Bendahara, Admin TU dengan role tertentu |
| FR-AUTH-04 | 1 akun Orang Tua dapat terhubung ke lebih dari 1 akun Siswa (untuk keluarga dengan beberapa anak di sekolah yang sama) |
| FR-AUTH-05 | Password reset via email/OTP |
| FR-AUTH-06 | Guru dapat memiliki multi-peran (mis. Guru Mapel sekaligus Wali Kelas) dalam 1 akun |

### 6.2 Modul: PPDB (Penerimaan Peserta Didik Baru)
| ID | Requirement |
|---|---|
| FR-PPDB-01 | Admin Sistem/TU dapat membuka periode pendaftaran PPDB baru (tahun ajaran, tanggal buka-tutup, jalur pendaftaran & kuota) |
| FR-PPDB-02 | Calon siswa/orang tua mendaftar online: isi data diri, data orang tua, upload berkas (KK, akta, rapor sebelumnya, foto, dll.) |
| FR-PPDB-03 | Sistem menghasilkan **nomor pendaftaran** unik yang dapat digunakan untuk cek status secara mandiri |
| FR-PPDB-04 | Admin TU melakukan verifikasi berkas per pendaftar: status Diterima/Ditolak/Perlu Revisi, dengan catatan |
| FR-PPDB-05 | Input nilai/skor seleksi (tes akademik, wawancara, dsb.) per pendaftar sesuai kriteria jalur |
| FR-PPDB-06 | Sistem dapat menghitung **ranking otomatis** berdasarkan skor & kuota per jalur untuk membantu keputusan kelulusan |
| FR-PPDB-07 | Admin TU/Kepsek menetapkan status akhir kelulusan (Diterima/Cadangan/Tidak Diterima) per pendaftar |
| FR-PPDB-08 | **Pengumuman online**: pendaftar dapat cek hasil kelulusan mandiri menggunakan nomor pendaftaran |
| FR-PPDB-09 | **Daftar ulang online**: pendaftar yang diterima mengonfirmasi daftar ulang, melengkapi data tambahan jika perlu, dan membayar biaya daftar ulang (jika ada) |
| FR-PPDB-10 | Setelah daftar ulang selesai, sistem otomatis membuat **data Siswa Aktif** + akun Siswa & Orang Tua, dan menempatkannya sesuai kelas yang ditentukan Admin TU |
| FR-PPDB-11 | Dashboard PPDB: jumlah pendaftar per jalur, status verifikasi, tingkat konversi diterima→daftar ulang |
| FR-PPDB-12 | Export data pendaftar & hasil PPDB ke Excel |

### 6.3 Modul: Academic Management
| ID | Requirement |
|---|---|
| FR-ACAD-01 | Admin Sistem mengelola **tahun ajaran & semester** aktif |
| FR-ACAD-02 | CRUD **kelas** (mis. 7A, 7B) per tahun ajaran, dengan penunjukan Wali Kelas |
| FR-ACAD-03 | CRUD **mata pelajaran**, dan penugasan **guru pengampu** per mapel per kelas |
| FR-ACAD-04 | Penempatan/pemindahan siswa ke kelas tertentu (manual atau hasil dari proses PPDB) |
| FR-ACAD-05 | Penyusunan **jadwal pelajaran** per kelas (hari, jam, mapel, guru, ruang) |
| FR-ACAD-06 | Guru menginput **komponen nilai**: Tugas, Ulangan Harian, UTS, UAS per siswa per mapel |
| FR-ACAD-07 | Admin Sistem/Kepsek dapat mengatur **bobot penilaian** (mis. Tugas 20%, UH 30%, UTS 20%, UAS 30%) yang digunakan untuk kalkulasi nilai akhir otomatis |
| FR-ACAD-08 | Sistem menghitung **nilai akhir & predikat** otomatis berdasarkan bobot yang dikonfigurasi |
| FR-ACAD-09 | Wali kelas dapat menambahkan catatan naratif/deskriptif di rapor (sikap, catatan wali kelas) |
| FR-ACAD-10 | **Cetak rapor** per siswa per semester dalam format PDF sesuai template sekolah |
| FR-ACAD-11 | Proses **kenaikan kelas**: promosikan siswa ke kelas & tahun ajaran berikutnya secara massal, dengan opsi pengecualian per siswa (tidak naik kelas) |
| FR-ACAD-12 | Riwayat akademik siswa (nilai & kelas dari tahun ke tahun) dapat dilihat dalam 1 profil siswa |

### 6.4 Modul: LMS (Learning Management System)
| ID | Requirement |
|---|---|
| FR-LMS-01 | Guru dapat mengunggah **materi ajar** (file/dokumen, tautan video, teks) per mapel & kelas yang diampu |
| FR-LMS-02 | Guru dapat membuat **tugas** dengan deskripsi, lampiran, dan tenggat waktu pengumpulan |
| FR-LMS-03 | Siswa dapat melihat daftar tugas aktif & mengumpulkan tugas (upload file/isi teks) sebelum/sesudah tenggat (dengan penanda "terlambat" jika lewat tenggat) |
| FR-LMS-04 | Guru menilai tugas yang dikumpulkan (skor + feedback/komentar), nilai otomatis menjadi komponen "Tugas" pada modul Akademik |
| FR-LMS-05 | Guru dapat membuat **kuis online** (pilihan ganda/isian singkat) dengan penilaian otomatis untuk pilihan ganda |
| FR-LMS-06 | **Forum/pengumuman kelas**: guru dapat membuat pengumuman atau diskusi per mapel/kelas, siswa dapat memberi komentar/pertanyaan |
| FR-LMS-07 | Siswa dapat melihat rekap seluruh materi & tugas per mapel dalam satu halaman kelas |
| FR-LMS-08 | Notifikasi ke siswa/orang tua saat ada tugas baru atau tenggat mendekati |

### 6.5 Modul: Presensi
| ID | Requirement |
|---|---|
| FR-ATT-01 | Wali kelas dapat menginput presensi **harian** untuk seluruh siswa di kelasnya (1x per hari) |
| FR-ATT-02 | *(Opsional, dikonfigurasi sekolah)* Guru mapel dapat menginput presensi **per jam pelajaran** untuk mapel yang diampu |
| FR-ATT-03 | Status kehadiran: Hadir, Sakit, Izin, Alpa, Terlambat, dengan catatan opsional |
| FR-ATT-04 | Siswa/Orang tua dapat mengajukan **izin/sakit** secara online (dengan upload surat jika perlu) untuk direview wali kelas |
| FR-ATT-05 | Rekap presensi per siswa, per kelas, per periode (mingguan/bulanan/semester) dengan persentase kehadiran |
| FR-ATT-06 | Notifikasi otomatis ke orang tua saat siswa tercatat **Alpa** (tidak hadir tanpa keterangan) pada hari tsb |
| FR-ATT-07 | Data rekap presensi menjadi salah satu komponen di rapor (jumlah sakit/izin/alpa per semester) |

### 6.6 Modul: Keuangan / SPP (Dasar)
| ID | Requirement |
|---|---|
| FR-FIN-01 | Admin/Bendahara dapat membuat **jenis tagihan** (SPP bulanan, uang gedung, uang kegiatan, dsb.) dengan nominal per jenjang/kelas |
| FR-FIN-02 | Sistem dapat men-generate **tagihan bulanan otomatis** untuk seluruh siswa aktif sesuai jenis tagihan yang berlaku |
| FR-FIN-03 | Bendahara mencatat **pembayaran** (manual dari bukti transfer/tunai, atau otomatis via integrasi payment gateway jika diaktifkan) |
| FR-FIN-04 | Status tagihan per siswa: Belum Bayar, Sebagian, Lunas, Terlambat |
| FR-FIN-05 | Laporan **tunggakan** per siswa/kelas/periode untuk ditindaklanjuti |
| FR-FIN-06 | Orang tua dapat melihat riwayat tagihan & pembayaran anak mereka, serta mengunduh bukti pembayaran/kwitansi |
| FR-FIN-07 | Reminder otomatis (notifikasi/email) ke orang tua saat tagihan mendekati/lewat jatuh tempo |
| FR-FIN-08 | Laporan rekap keuangan SPP untuk Kepala Sekolah (total tertagih, total terbayar, total tunggakan per periode) |

### 6.7 Modul: Dashboard & Notifikasi
| ID | Requirement |
|---|---|
| FR-DASH-01 | Dashboard khusus per role: Kepsek (ringkasan sekolah), Guru (kelas & tugas yang perlu dinilai), Siswa (tugas & jadwal hari ini), Orang Tua (ringkasan anak), Bendahara (tagihan jatuh tempo) |
| FR-NOTIF-01 | Notifikasi in-app & email untuk: pengumuman PPDB, nilai/rapor terbit, tugas baru, siswa alpa, tagihan jatuh tempo |
| FR-NOTIF-02 | Pengaturan preferensi notifikasi (aktif/nonaktif per jenis) oleh masing-masing pengguna |

### 6.8 Modul: Pengaturan (Settings)
| ID | Requirement |
|---|---|
| FR-SET-01 | Pengaturan profil sekolah (nama, logo, alamat, kop surat untuk dokumen cetak) |
| FR-SET-02 | Pengaturan tahun ajaran aktif & periode semester |
| FR-SET-03 | Pengaturan bobot penilaian & template rapor |
| FR-SET-04 | Pengaturan jenis & nominal tagihan keuangan |
| FR-SET-05 | Pengaturan kebijakan presensi (per hari vs per jam pelajaran) |
| FR-SET-06 | Pengaturan jalur & kuota PPDB per periode pendaftaran |

---

## 7. User Flows Utama

### 7.1 Flow: Pendaftaran PPDB hingga Menjadi Siswa Aktif
1. Admin TU membuka periode PPDB baru dengan jalur & kuota yang ditentukan.
2. Calon siswa/orang tua mengakses halaman pendaftaran publik → isi data diri, data orang tua, upload berkas → dapat nomor pendaftaran.
3. Admin TU memverifikasi berkas satu per satu → update status (Diterima Berkas/Perlu Revisi/Ditolak).
4. Jika ada tes seleksi, Admin TU/panitia input nilai seleksi → sistem hitung ranking otomatis per jalur.
5. Kepala Sekolah/Admin TU menetapkan status kelulusan akhir per pendaftar.
6. Sistem publikasikan pengumuman → pendaftar cek status via nomor pendaftaran.
7. Pendaftar yang diterima melakukan **daftar ulang online** (konfirmasi + bayar biaya daftar ulang jika ada).
8. Sistem otomatis: buat data Siswa Aktif, buat akun Siswa & Orang Tua, tempatkan siswa ke kelas yang ditentukan Admin TU.
9. Siswa & Orang Tua menerima kredensial akun untuk login ke portal akademik.

### 7.2 Flow: Guru Input Nilai & Rapor Terbit
1. Guru mapel login → pilih kelas & mapel yang diampu.
2. Sepanjang semester, guru input nilai Tugas (otomatis dari LMS), Ulangan Harian, UTS, UAS per siswa.
3. Menjelang akhir semester, wali kelas membuka rekap nilai seluruh mapel di kelasnya (otomatis terkumpul dari tiap guru mapel).
4. Wali kelas menambahkan catatan naratif & memeriksa kelengkapan data (termasuk rekap presensi).
5. Wali kelas/Admin TU generate & cetak rapor PDF per siswa.
6. Rapor dipublikasikan ke portal Siswa/Orang Tua (dapat dilihat online dan/atau diunduh).

### 7.3 Flow: Presensi Harian & Notifikasi ke Orang Tua
1. Wali kelas membuka menu presensi kelasnya di pagi hari → tandai status tiap siswa (Hadir/Sakit/Izin/Alpa).
2. Jika ada siswa berstatus **Alpa**, sistem otomatis mengirim notifikasi ke Orang Tua siswa tsb pada hari yang sama.
3. Orang tua dapat memantau rekap kehadiran anak dari dashboard kapan saja.
4. Jika siswa sakit/izin, orang tua/siswa dapat mengajukan surat izin online sebelum wali kelas menandai presensi, sehingga status otomatis tercatat sesuai pengajuan (dengan approval wali kelas).

### 7.4 Flow: Tugas LMS dari Guru ke Siswa
1. Guru membuat tugas baru di mapelnya: judul, instruksi, lampiran, tenggat waktu.
2. Siswa menerima notifikasi tugas baru → mengerjakan & mengumpulkan (upload file/isi jawaban) sebelum tenggat.
3. Guru meninjau seluruh submission → memberi nilai & feedback per siswa.
4. Nilai tugas otomatis tersimpan sebagai komponen nilai akademik mapel tsb (mengalir ke perhitungan nilai akhir/rapor).

### 7.5 Flow: Tagihan SPP & Pembayaran oleh Orang Tua
1. Bendahara men-generate tagihan SPP bulanan untuk seluruh siswa aktif (otomatis berdasarkan pengaturan nominal per kelas/jenjang).
2. Orang tua menerima notifikasi tagihan baru → login ke portal untuk melihat detail tagihan.
3. Orang tua melakukan pembayaran (transfer manual dengan upload bukti, atau via payment gateway jika diaktifkan).
4. Bendahara memverifikasi & mencatat pembayaran (jika manual) → status tagihan berubah menjadi Lunas.
5. Jika lewat jatuh tempo tanpa pembayaran, sistem kirim reminder otomatis & status berubah menjadi Terlambat, muncul di laporan tunggakan bendahara.

---

## 8. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Requirement |
|---|---|
| **Performance** | Waktu respon API < 500ms untuk 95% request; halaman dashboard utama termuat < 2 detik |
| **Skalabilitas** | Sistem harus mampu menangani beban akses serentak tinggi saat momen tertentu (mis. hari pengumuman PPDB, hari rapor terbit) tanpa downtime |
| **Keamanan** | Data pribadi siswa (NIK, KK, data orang tua) dienkripsi & diakses sesuai RBAC ketat; komunikasi HTTPS/TLS; password di-hash |
| **Privasi Data** | Kepatuhan terhadap UU PDP untuk data pribadi siswa & orang tua (data anak adalah kategori sensitif) |
| **Availability** | Uptime ≥ 99.5%; backup database harian otomatis dengan retensi minimal 60 hari (mengingat pentingnya data akademik) |
| **Kompatibilitas** | Web app harus fully responsive — dapat diakses baik dari laptop/PC (guru/admin/bendahara) maupun HP (siswa/orang tua) via browser |
| **Usability** | UI untuk siswa & orang tua harus sangat sederhana (minim training); UI guru/admin dioptimalkan untuk efisiensi input data massal |
| **Auditability** | Semua perubahan nilai, presensi, dan status kelulusan PPDB tercatat dalam audit log (siapa mengubah, kapan, nilai sebelum/sesudah) |
| **Data Retention** | Data akademik siswa yang sudah lulus/keluar tetap tersimpan (arsip) untuk keperluan legalisir/riwayat, tidak dihapus permanen |
| **Localization** | Bahasa Indonesia default, format tanggal Indonesia, kalender tahun ajaran Juli-Juni (dapat disesuaikan) |

---

## 9. Model Data / Entitas Utama (High-Level Data Model)

**Entitas Inti:**
- `School` — id, nama_sekolah, alamat, logo, jenjang
- `AcademicYear` — id, tahun_ajaran, semester, status_aktif
- `User` — id, nama, email, role, status
- `PPDBPeriod` — id, academic_year_id, jalur[], kuota, tanggal_buka, tanggal_tutup
- `Applicant` (Pendaftar PPDB) — id, ppdb_period_id, nomor_pendaftaran, data_diri, data_ortu, jalur, status_verifikasi, nilai_seleksi, status_kelulusan
- `ApplicantDocument` — id, applicant_id, jenis_dokumen, file_url, status_verifikasi
- `Student` (Siswa Aktif) — id, applicant_id (nullable, jika bukan dari PPDB), nis, nama, tanggal_lahir, status (aktif/lulus/pindah)
- `Parent` (Orang Tua) — id, user_id, nama, kontak
- `StudentParent` — id, student_id, parent_id, hubungan
- `Class` (Kelas) — id, academic_year_id, nama_kelas, wali_kelas_id
- `ClassEnrollment` — id, student_id, class_id, academic_year_id
- `Subject` (Mata Pelajaran) — id, nama_mapel
- `TeacherAssignment` — id, teacher_id, subject_id, class_id, academic_year_id
- `Schedule` (Jadwal) — id, class_id, subject_id, teacher_id, hari, jam_mulai, jam_selesai
- `GradeComponent` (Komponen Nilai) — id, tenant/school_id, nama (Tugas/UH/UTS/UAS), bobot_persen
- `Grade` (Nilai) — id, student_id, subject_id, academic_year_id, semester, grade_component_id, nilai
- `ReportCard` (Rapor) — id, student_id, class_id, academic_year_id, semester, catatan_wali_kelas, file_pdf
- `LMSMaterial` — id, subject_id, class_id, judul, file_url/link, tanggal_upload
- `LMSAssignment` (Tugas) — id, subject_id, class_id, judul, deskripsi, tenggat_waktu
- `LMSSubmission` — id, assignment_id, student_id, file_url/jawaban, waktu_kumpul, nilai, feedback
- `LMSQuiz` — id, subject_id, class_id, judul, pertanyaan[]
- `Attendance` (Presensi) — id, student_id, class_id, subject_id (nullable jika harian), tanggal, status, catatan
- `LeaveRequest` (Pengajuan Izin) — id, student_id, tanggal, jenis (sakit/izin), lampiran, status_approval
- `BillingType` (Jenis Tagihan) — id, nama (SPP/Uang Gedung), nominal_default
- `Invoice` (Tagihan) — id, student_id, billing_type_id, periode, nominal, status, jatuh_tempo
- `Payment` — id, invoice_id, jumlah, tanggal, metode, bukti_url
- `Notification` — id, user_id, tipe, konten, status_baca
- `AuditLog` — id, user_id, aksi, detail, timestamp

**Relasi Kunci:**
- 1 `Applicant` (PPDB, setelah daftar ulang) → menghasilkan 1 `Student` + akun `User` (Siswa) + `Parent` terhubung via `StudentParent`.
- 1 `Student` → banyak `ClassEnrollment` (riwayat kelas per tahun ajaran) → dasar untuk riwayat akademik lintas tahun.
- 1 `Student` + `Subject` + `AcademicYear` + `Semester` → banyak `Grade` (per `GradeComponent`) → diagregasi menjadi 1 `ReportCard`.
- 1 `LMSAssignment` → banyak `LMSSubmission` → nilai submission mengalir ke `Grade` dengan `grade_component_id` = "Tugas".
- 1 `Student` → banyak `Invoice` → tiap `Invoice` punya 0..n `Payment` (mendukung pembayaran cicilan).

---

## 10. Pertimbangan Teknis (Technical Considerations)

- **Arsitektur:** Single-school deployment (bukan multi-tenant SaaS di V1), namun struktur data & modul dirancang modular per domain (PPDB, Akademik, LMS, Presensi, Keuangan) agar mudah dipisah menjadi microservice atau direplikasi ke sekolah lain di masa depan.
- **Backend:** REST API/GraphQL dengan JWT auth, RBAC middleware granular (role + scope kelas/mapel untuk guru).
- **Database:** PostgreSQL/MySQL — relasi kompleks antar akademik & PPDB memerlukan desain skema yang hati-hati terhadap **integritas referensial** (mis. siswa tidak boleh punya nilai untuk mapel yang tidak diampu gurunya di kelas tsb).
- **File Storage:** Object storage (S3-compatible) untuk berkas PPDB, lampiran tugas LMS, dan bukti pembayaran, dengan kontrol akses berbasis kepemilikan data.
- **Kalkulasi Nilai:** Engine perhitungan nilai akhir berbasis bobot dinamis (dikonfigurasi Admin/Kepsek) — hindari hardcode rumus agar fleksibel per kebijakan sekolah/kurikulum.
- **PDF Generation:** Modul cetak rapor & kwitansi menggunakan template HTML-to-PDF yang dapat dikustomisasi per sekolah (kop surat, tanda tangan digital kepala sekolah/wali kelas).
- **Notifikasi:** Email (SMTP/Sendgrid) sebagai kanal utama V1; arsitektur notifikasi dirancang agar mudah ditambah kanal lain (WhatsApp/push mobile) di fase berikutnya.
- **Concurrency PPDB:** Perlu penanganan lonjakan trafik saat hari pembukaan pendaftaran/pengumuman (caching halaman pengumuman, rate limiting pada endpoint publik).
- **Payment Gateway (opsional):** Integrasi Midtrans/Xendit untuk pembayaran SPP & biaya daftar ulang non-tunai.
- **Hosting/Infra:** Cloud (AWS/GCP), backup otomatis, monitoring uptime khususnya menjelang periode kritikal (PPDB, akhir semester).

---

## 11. Roadmap / Rencana Rilis

| Fase | Fitur Utama | Estimasi |
|---|---|---|
| **Fase 0 — Setup Dasar** | Auth & role, pengaturan sekolah, tahun ajaran, struktur kelas & mapel | 2-3 minggu |
| **Fase 1 — PPDB** | Pendaftaran online, verifikasi berkas, seleksi & ranking, pengumuman, daftar ulang → auto-create data siswa aktif | 5-7 minggu |
| **Fase 2 — Academic Management Inti** | Input nilai, bobot penilaian, kalkulasi nilai akhir, cetak rapor, kenaikan kelas | 5-7 minggu |
| **Fase 3 — Presensi** | Presensi harian/per mapel, pengajuan izin online, rekap & notifikasi alpa | 3-4 minggu |
| **Fase 4 — LMS** | Materi, tugas, pengumpulan tugas, penilaian tugas terhubung ke nilai akademik, kuis online sederhana | 5-6 minggu |
| **Fase 5 — Keuangan/SPP** | Tagihan otomatis, pencatatan pembayaran, laporan tunggakan, portal orang tua | 4-5 minggu |
| **Fase 6 — Dashboard & Notifikasi Terpadu** | Dashboard per role, notifikasi lintas modul, laporan gabungan untuk Kepsek | 3-4 minggu |
| **Fase 7 — Skalabilitas (Post-MVP)** | Aplikasi mobile, integrasi Dapodik, multi-sekolah/yayasan, modul perpustakaan & sarpras | TBD |

---

## 12. Risiko & Asumsi

### 12.1 Risiko
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Lonjakan trafik ekstrem saat hari pengumuman PPDB | Sistem down, kepercayaan orang tua menurun | Load testing sebelum periode PPDB, caching halaman pengumuman, rate limiting |
| Guru kurang melek teknologi, enggan input nilai/presensi online | Adopsi rendah, data tidak lengkap | UI sederhana, training onboarding, dukungan input massal (bulk entry/import Excel) |
| Kesalahan bobot nilai menyebabkan nilai akhir tidak sesuai kebijakan kurikulum sekolah | Rapor salah, komplain orang tua | Pengaturan bobot fleksibel & preview kalkulasi sebelum publikasi rapor final |
| Data pribadi siswa (NIK, KK) bocor/disalahgunakan | Masalah hukum & kepercayaan | Enkripsi data sensitif, akses ketat berbasis RBAC, audit log |
| Orang tua tidak terbiasa mengecek portal, notifikasi terlewat | Informasi penting tidak sampai | Kombinasi notifikasi in-app + email, dan pertimbangan kanal tambahan (WA) di fase berikutnya |

### 12.2 Asumsi
- Sistem digunakan oleh 1 sekolah (bukan yayasan dengan banyak sekolah) — namun arsitektur modular disiapkan agar dapat direplikasi.
- Sekolah memiliki koneksi internet yang memadai di area administrasi (TU, ruang guru) untuk operasional harian.
- Proses verifikasi berkas fisik PPDB (jika ada) tetap dapat dilakukan offline di sekolah, dengan hasil akhirnya diinput ke sistem.
- Pembayaran SPP mayoritas masih manual (transfer bank dengan verifikasi bendahara); integrasi payment gateway bersifat opsional/tambahan.

---

## 13. Glosarium

| Istilah | Definisi |
|---|---|
| **PPDB** | Penerimaan Peserta Didik Baru — proses pendaftaran & seleksi siswa baru |
| **LMS** | Learning Management System — sistem pengelolaan pembelajaran (materi, tugas, kuis) |
| **Wali Kelas** | Guru yang bertanggung jawab atas 1 kelas tertentu, termasuk rekap nilai & rapor |
| **Rapor** | Laporan hasil belajar siswa per semester |
| **UH/UTS/UAS** | Ulangan Harian / Ujian Tengah Semester / Ujian Akhir Semester |
| **SPP** | Sumbangan Pembinaan Pendidikan — iuran bulanan sekolah |
| **Kenaikan Kelas** | Proses promosi siswa ke kelas & tahun ajaran berikutnya |
| **Bobot Penilaian** | Persentase kontribusi tiap komponen nilai (tugas, ulangan, dll.) terhadap nilai akhir |

---

## 14. Lampiran — Prioritas Fitur untuk MVP (Ringkasan Cepat)

**Must Have (P0):**
- Auth & role (Admin Sistem, Admin TU, Guru, Wali Kelas, Siswa, Orang Tua, Bendahara)
- PPDB: pendaftaran online, verifikasi, pengumuman, daftar ulang → auto-create siswa aktif
- Academic: kelas, mapel, jadwal, input nilai, kalkulasi nilai akhir, cetak rapor
- Presensi harian dengan rekap dasar
- Keuangan: tagihan SPP otomatis & pencatatan pembayaran manual

**Should Have (P1):**
- LMS: materi, tugas, pengumpulan tugas, penilaian tugas terhubung nilai akademik
- Notifikasi alpa & tagihan jatuh tempo ke orang tua
- Pengajuan izin/sakit online
- Laporan tunggakan SPP

**Nice to Have (P2):**
- Kuis online otomatis (pilihan ganda)
- Forum/pengumuman kelas di LMS
- Dashboard analitik lintas modul untuk Kepala Sekolah
- Integrasi payment gateway untuk SPP

**Future (P3 - Fase 2+):**
- Aplikasi mobile (Siswa, Orang Tua, Guru)
- Integrasi Dapodik/pelaporan Dinas Pendidikan
- Mode multi-sekolah/yayasan
- Modul Perpustakaan & Sarpras/Inventaris

---

*Dokumen ini adalah living document — dapat diperbarui seiring hasil diskusi teknis dan feedback pengguna selama proses development.*
