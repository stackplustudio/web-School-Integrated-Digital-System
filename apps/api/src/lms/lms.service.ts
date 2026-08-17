import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private prisma: PrismaService) {}

  // 1. Mengambil daftar kelas & mapel yang diajar oleh guru (atau semua jika Admin)
  async getMyClasses(userId: string, role: string) {
    const whereClause = role === 'GURU' ? { teacherId: userId } : {};
    
    const schedules = await this.prisma.schedule.findMany({
      where: whereClause,
      include: {
        class: true,
        subject: true,
      },
    });

    // Mengelompokkan kombinasi Kelas dan Mapel yang unik
    const uniqueClasses = [];
    const map = new Map();

    for (const sched of schedules) {
      const key = `${sched.classId}-${sched.subjectId}`;
      if (!map.has(key)) {
        map.set(key, true);
        uniqueClasses.push({
          id: key,
          classId: sched.classId,
          className: sched.class.nama_kelas,
          subjectId: sched.subjectId,
          subjectName: sched.subject.nama_mapel,
        });
      }
    }

    return uniqueClasses;
  }

  // 2. Manajemen Materi
  async getMaterials(classId: string, subjectId: string) {
    return this.prisma.lMSMaterial.findMany({
      where: { classId, subjectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMaterial(data: { classId: string; subjectId: string; judul: string; file_url?: string }) {
    return this.prisma.lMSMaterial.create({ data });
  }

  // 3. Manajemen Tugas
  async getAssignments(classId: string, subjectId: string) {
    return this.prisma.lMSAssignment.findMany({
      where: { classId, subjectId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { submissions: true } } // Hitung jumlah siswa yang sudah kumpul
      }
    });
  }

  async createAssignment(data: { classId: string; subjectId: string; judul: string; deskripsi: string; tenggat_waktu: string }) {
    return this.prisma.lMSAssignment.create({
      data: {
        classId: data.classId,
        subjectId: data.subjectId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        tenggat_waktu: new Date(data.tenggat_waktu), // Parse ke DateTime Prisma
      },
    });
  }
}