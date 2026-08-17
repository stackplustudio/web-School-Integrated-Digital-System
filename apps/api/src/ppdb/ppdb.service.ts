import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PpdbService {
  constructor(private prisma: PrismaService) {}
  
  // 🔥 Fungsi register kembali!
  async register(data: any) {
    const activeYear = await this.prisma.academicYear.findFirst({ where: { status_aktif: true } });
    if (!activeYear) throw new BadRequestException('Tidak ada tahun ajaran yang aktif saat ini.');

    let ppdbPeriod = await this.prisma.pPDBPeriod.findFirst({ where: { academicYearId: activeYear.id } });
    if (!ppdbPeriod) {
      ppdbPeriod = await this.prisma.pPDBPeriod.create({
        data: {
          academicYearId: activeYear.id,
          jalur: ['Reguler', 'Prestasi', 'Afirmasi'],
          kuota: 100,
          tanggal_buka: new Date(),
          tanggal_tutup: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const nomorPendaftaran = `PPDB-${new Date().getFullYear()}-${randomNum}`;

    const applicant = await this.prisma.applicant.create({
      data: {
        ppdbPeriodId: ppdbPeriod.id,
        nomor_pendaftaran: nomorPendaftaran,
        data_diri: data.data_diri,
        data_ortu: data.data_ortu,
        jalur: data.jalur,
        status_verifikasi: 'MENUNGGU',
        status_kelulusan: 'BELUM_DITENTUKAN',
      },
    });

    return { message: 'Pendaftaran PPDB Berhasil!', nomor_pendaftaran: applicant.nomor_pendaftaran };
  }

  // 🔥 Fungsi findAll kembali!
  async findAll() {
    return this.prisma.applicant.findMany({
      orderBy: { createdAt: 'desc' },
      include: { student: true } 
    });
  }

  async updateStatus(id: string, updateData: { status_verifikasi?: any; status_kelulusan?: any }) {
    const applicant = await this.prisma.applicant.findUnique({ where: { id } });
    if (!applicant) throw new NotFoundException('Data pendaftar tidak ditemukan.');

    return this.prisma.applicant.update({
      where: { id },
      data: {
        ...(updateData.status_verifikasi && { status_verifikasi: updateData.status_verifikasi }),
        ...(updateData.status_kelulusan && { status_kelulusan: updateData.status_kelulusan }),
      },
    });
  }

  async generateStudentAccount(applicantId: string) {
    const applicant = await this.prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { student: true }
    });

    if (!applicant) throw new NotFoundException('Data pendaftar tidak ditemukan.');
    if (applicant.status_kelulusan !== 'DITERIMA') throw new BadRequestException('Calon siswa belum dinyatakan DITERIMA.');
    if (applicant.student) throw new BadRequestException('Akun siswa untuk pendaftar ini sudah dibuat.');

    const dataDiri = applicant.data_diri as any;
    const nisn = dataDiri?.nisn || `00${Math.floor(Math.random() * 1000000)}`;
    const nama = dataDiri?.nama || 'Siswa Baru';

    const email = `${nisn}@siswa.stackplustudio.com`;
    const plainPassword = `${nisn}#Stack`;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const nis = `${currentYear}${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await this.prisma.$transaction(async (prisma: any) => {
      const user = await prisma.user.create({
        data: {
          email,
          name: nama,
          password: hashedPassword,
          role: 'SISWA' as any, 
        }
      });

      const tanggalLahir = dataDiri?.tanggal_lahir 
        ? new Date(dataDiri.tanggal_lahir) 
        : new Date('2010-01-01T00:00:00Z');

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          applicantId: applicant.id,
          nis: nis,
          nama: nama, 
          tanggal_lahir: tanggalLahir, 
        }
      });

      return { user, student, plainPassword };
    });

    return {
      message: 'Berhasil membuat akun siswa!',
      email: result.user.email,
      password: result.plainPassword,
      nis: result.student.nis
    };
  }
}