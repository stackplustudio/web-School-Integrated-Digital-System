import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  // Menarik semua jadwal beserta nama kelas, mapel, dan guru
  async findAll() {
    return this.prisma.schedule.findMany({
      include: {
        class: { select: { nama_kelas: true } },
        subject: { select: { nama_mapel: true } },
        teacher: { select: { name: true } },
      },
      orderBy: [
        { hari: 'asc' }, 
        { jam_mulai: 'asc' }
      ],
    });
  }

  // Membuat Jadwal Baru
  async create(data: { classId: string; subjectId: string; teacherId: string; hari: string; jam_mulai: string; jam_selesai: string }) {
    // Validasi bentrok (opsional dasar): Cek apakah guru sudah mengajar di hari dan jam yang sama
    const clash = await this.prisma.schedule.findFirst({
      where: {
        teacherId: data.teacherId,
        hari: data.hari,
        jam_mulai: data.jam_mulai, // Simplifikasi: cek jam mulai yang sama persis
      }
    });

    if (clash) {
      throw new BadRequestException('Guru tersebut sudah memiliki jadwal mengajar di hari dan jam yang sama.');
    }

    const newSchedule = await this.prisma.schedule.create({
      data: {
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        hari: data.hari,
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
      },
    });

    return {
      message: 'Jadwal pelajaran berhasil dibuat!',
      schedule: newSchedule,
    };
  }
}