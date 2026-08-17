import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 1. HAPUS import { VerificationStatus, AdmissionStatus }
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PpdbService {
  constructor(private prisma: PrismaService) {}
  
  // ... (kode register tetap sama)

  async updateStatus(id: string, updateData: { status_verifikasi?: any; status_kelulusan?: any }) {
    const applicant = await this.prisma.applicant.findUnique({ where: { id } });
    if (!applicant) throw new NotFoundException('Data pendaftar tidak ditemukan.');

    return this.prisma.applicant.update({
      where: { id },
      data: {
        // 2. Ganti casting 'as VerificationStatus' menjadi 'as any' atau hapus casting-nya
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

    // 3. Ubah (prisma) menjadi (prisma: any)
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