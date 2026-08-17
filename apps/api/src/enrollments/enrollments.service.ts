import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  // 1. Menarik detail kelas beserta siswa yang SUDAH masuk ke kelas tersebut
  async getClassEnrollments(classId: string) {
    return this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        academicYear: true,
        waliKelas: { select: { name: true } },
        enrollments: {
          include: {
            student: true, // Ambil data siswa-nya
          },
        },
      },
    });
  }

  // 2. Menarik daftar siswa yang BELUM memiliki kelas pada tahun ajaran aktif
  async getUnenrolledStudents() {
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { status_aktif: true },
    });

    if (!activeYear) throw new BadRequestException('Tidak ada tahun ajaran aktif.');

    // Cari siswa yang tidak memiliki ClassEnrollment di tahun ajaran aktif ini
    return this.prisma.student.findMany({
      where: {
        enrollments: {
          none: {
            academicYearId: activeYear.id,
          },
        },
      },
      orderBy: { nama: 'asc' },
    });
  }

  // 3. Mengeksekusi penempatan siswa ke dalam kelas
  async enrollStudent(classId: string, studentId: string) {
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { status_aktif: true },
    });
    if (!activeYear) throw new BadRequestException('Tidak ada tahun ajaran aktif.');

    // Validasi: Apakah siswa sudah ada di kelas lain?
    const existingEnrollment = await this.prisma.classEnrollment.findFirst({
      where: { studentId, academicYearId: activeYear.id },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Siswa ini sudah terdaftar di sebuah kelas pada tahun ajaran ini.');
    }

    return this.prisma.classEnrollment.create({
      data: {
        classId,
        studentId,
        academicYearId: activeYear.id,
      },
    });
  }
}