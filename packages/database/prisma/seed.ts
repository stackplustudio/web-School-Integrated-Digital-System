import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database SIDS...');

  // 1. SETUP MASTER DATA: Sekolah & Tahun Ajaran
  let school = await prisma.school.findFirst();
  if (!school) {
    school = await prisma.school.create({
      data: {
        nama_sekolah: 'SMK Informatika Stack Plus',
        alamat: 'Jl. Mampang Prapatan, Jakarta Selatan',
        jenjang: 'SMK',
      },
    });
    console.log(`✅ Master Data Sekolah dibuat: ${school.nama_sekolah}`);
  }

  let academicYear = await prisma.academicYear.findFirst();
  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        tahun_ajaran: '2026/2027',
        semester: 'Ganjil',
        status_aktif: true,
      },
    });
    console.log(`✅ Master Data Tahun Ajaran dibuat: ${academicYear.tahun_ajaran} - ${academicYear.semester}`);
  }

  // 2. ENKRIPSI PASSWORD
  const superAdminPass = await bcrypt.hash('stackplustudio', 10);
  const adminPass = await bcrypt.hash('stackplustudio6', 10);
  const userPass = await bcrypt.hash('stackplustudio3', 10);

  // 3. SEEDING AKUN USERS
  
  // A. Super Admin (Akses Penuh SIDS)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'stackplustudio@gmail.com' },
    update: { password: superAdminPass, role: 'ADMIN_SISTEM' },
    create: {
      email: 'stackplustudio@gmail.com',
      name: 'Super Admin Stack Plus',
      password: superAdminPass,
      role: 'ADMIN_SISTEM',
    },
  });
  console.log(`✅ Super Admin seeded: ${superAdmin.email}`);

  // B. Admin TU (Panitia PPDB & Tata Usaha)
  // Email dibedakan agar tidak bentrok (karena email @unique)
  const adminTu = await prisma.user.upsert({
    where: { email: 'admin@stackplustudio.com' },
    update: { password: adminPass, role: 'ADMIN_TU' },
    create: {
      email: 'admin@stackplustudio.com',
      name: 'Admin Tata Usaha',
      password: adminPass,
      role: 'ADMIN_TU',
    },
  });
  console.log(`✅ Admin TU seeded: ${adminTu.email}`);

  // C. User Biasa / Siswa
  const siswa = await prisma.user.upsert({
    where: { email: 'budicahyono@gmail.com' },
    update: { password: userPass, role: 'SISWA', name: 'Budi Cahyono' },
    create: {
      email: 'budicahyono@gmail.com',
      name: 'Budi Cahyono',
      password: userPass,
      role: 'SISWA',
    },
  });
  console.log(`✅ User Siswa seeded: ${siswa.email}`);

  // 4. MEMBUAT PROFIL SISWA AKTIF UNTUK BUDI
  // Profil ini diperlukan agar Budi bisa mengakses fitur LMS dan Rapor SIDS nanti
  const studentProfile = await prisma.student.findUnique({
    where: { userId: siswa.id },
  });

  if (!studentProfile) {
    await prisma.student.create({
      data: {
        userId: siswa.id,
        nis: '26042026',
        nama: siswa.name || 'Budi Cahyono',
        tanggal_lahir: new Date('2003-05-01'), 
        status: 'AKTIF',
      },
    });
    console.log(`✅ Profil Akademik Siswa dibuat untuk Budi Cahyono`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🛑 Koneksi database ditutup.');
  });