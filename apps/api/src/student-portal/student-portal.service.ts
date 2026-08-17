import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentPortalService {
  constructor(private prisma: PrismaService) {}

  // 1. Mengambil seluruh data dashboard siswa (Jadwal, Materi, Tugas)
  async getDashboardData(userId: string) {
    // Cari data Student berdasarkan userId (akun login)
    const student = await this.prisma.student.findFirst({
      where: { userId },
    });
    if (!student) throw new NotFoundException('Data akademik siswa tidak ditemukan.');

    // Cari tahun ajaran aktif
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { status_aktif: true },
    });
    if (!activeYear) throw new BadRequestException('Tidak ada tahun ajaran aktif.');

    // Cari kelas siswa saat ini
    const enrollment = await this.prisma.classEnrollment.findFirst({
      where: { studentId: student.id, academicYearId: activeYear.id },
      include: { class: true },
    });

    if (!enrollment) {
      return { hasClass: false, message: 'Anda belum ditempatkan di kelas manapun oleh Admin.' };
    }

    const classId = enrollment.classId;

    // Ambil Jadwal
    const schedules = await this.prisma.schedule.findMany({
      where: { classId },
      include: { subject: true, teacher: true },
      orderBy: [{ hari: 'asc' }, { jam_mulai: 'asc' }],
    });

    // Ambil Materi
    const materials = await this.prisma.lMSMaterial.findMany({
      where: { classId },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    });

    // Ambil Tugas beserta status pengumpulan siswa ini
    const assignments = await this.prisma.lMSAssignment.findMany({
      where: { classId },
      include: {
        subject: true,
        submissions: {
          where: { studentId: student.id }, // Hanya ambil submission milik siswa ini
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      hasClass: true,
      studentInfo: student,
      classInfo: enrollment.class,
      schedules,
      materials,
      assignments,
    };
  }

  // 2. Fungsi untuk siswa mengumpulkan tugas
  async submitAssignment(userId: string, body: { assignmentId: string; jawaban: string; file_url?: string }) {
    const student = await this.prisma.student.findFirst({ where: { userId } });
    if (!student) throw new NotFoundException('Data siswa tidak ditemukan.');

    // Cek apakah siswa sudah mengumpulkan tugas ini sebelumnya
    const existing = await this.prisma.lMSSubmission.findFirst({
      where: { assignmentId: body.assignmentId, studentId: student.id },
    });

    if (existing) {
      throw new BadRequestException('Anda sudah mengumpulkan tugas ini sebelumnya.');
    }

    return this.prisma.lMSSubmission.create({
      data: {
        assignmentId: body.assignmentId,
        studentId: student.id,
        jawaban: body.jawaban,
        file_url: body.file_url,
      },
    });
  }
}