import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  // Menarik semua kelas beserta nama wali kelas dan jumlah siswanya
  async findAll() {
    return this.prisma.class.findMany({
      include: {
        waliKelas: { select: { name: true } },
        academicYear: { select: { tahun_ajaran: true, semester: true } },
        _count: { select: { enrollments: true } }, // Menghitung jumlah siswa di kelas ini
      },
      orderBy: { nama_kelas: 'asc' },
    });
  }

  // Membuat Kelas Baru
  async create(data: { nama_kelas: string; waliKelasId: string }) {
    // Cari tahun ajaran yang sedang aktif
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { status_aktif: true },
    });

    if (!activeYear) {
      throw new BadRequestException('Tidak ada tahun ajaran yang aktif saat ini.');
    }

    // Pastikan nama kelas belum ada di tahun ajaran yang sama
    const existingClass = await this.prisma.class.findFirst({
      where: { 
        nama_kelas: data.nama_kelas,
        academicYearId: activeYear.id
      }
    });

    if (existingClass) {
      throw new BadRequestException(`Kelas ${data.nama_kelas} sudah ada di tahun ajaran ini.`);
    }

    const newClass = await this.prisma.class.create({
      data: {
        nama_kelas: data.nama_kelas,
        waliKelasId: data.waliKelasId,
        academicYearId: activeYear.id,
      },
      include: {
        waliKelas: { select: { name: true } }
      }
    });

    return {
      message: 'Kelas berhasil dibuat!',
      class: newClass,
    };
  }
}