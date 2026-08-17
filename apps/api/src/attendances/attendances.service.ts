import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  // 1. Mengambil daftar siswa beserta status presensi mereka jika sudah pernah diisi
  async getAttendanceList(classId: string, subjectId: string, tanggal: string) {
    const startOfDay = new Date(tanggal);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tanggal);
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil daftar siswa yang terdaftar (enroll) di kelas tersebut
    const activeYear = await this.prisma.academicYear.findFirst({ where: { status_aktif: true } });
    if (!activeYear) throw new BadRequestException('Tahun ajaran aktif tidak ditemukan.');

    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { classId, academicYearId: activeYear.id },
      include: { student: true },
      orderBy: { student: { nama: 'asc' } }
    });

    // Ambil data presensi yang sudah ada pada tanggal tersebut
    const existingAttendances = await this.prisma.attendance.findMany({
      where: {
        classId,
        subjectId: subjectId || undefined,
        tanggal: { gte: startOfDay, lte: endOfDay }
      }
    });

    const attendanceMap = new Map();
    existingAttendances.forEach((a: any) => attendanceMap.set(a.studentId, a.status));

    // Gabungkan data
    return enrollments.map((e: any) => ({
      studentId: e.studentId,
      nis: e.student.nis,
      nama: e.student.nama,
      status: attendanceMap.get(e.studentId) || 'HADIR' // Default 'HADIR' jika belum diabsen
    }));
  }

  // 2. Menyimpan atau Memperbarui Presensi (Batch/Massal)
  async saveAttendance(body: { classId: string; subjectId: string; tanggal: string; records: { studentId: string; status: any }[] }) {
    const targetDate = new Date(body.tanggal);
    targetDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(body.tanggal);
    endOfDay.setHours(23, 59, 59, 999);

    // Hapus data absen lama pada tanggal dan kelas yang sama (mencegah duplikasi tanpa custom ID)
    await this.prisma.attendance.deleteMany({
      where: {
        classId: body.classId,
        subjectId: body.subjectId,
        tanggal: { gte: targetDate, lte: endOfDay }
      }
    });

    // Masukkan data absen baru yang di-submit
    const dataToInsert = body.records.map(record => ({
      studentId: record.studentId,
      classId: body.classId,
      subjectId: body.subjectId,
      tanggal: targetDate,
      status: record.status,
    }));

    await this.prisma.attendance.createMany({
      data: dataToInsert
    });

    return { message: 'Data presensi berhasil disimpan!' };
  }
}