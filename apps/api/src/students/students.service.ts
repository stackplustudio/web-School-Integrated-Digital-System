import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // Menarik semua data siswa yang sudah aktif, termasuk email dari tabel User
  async findAll() {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { nis: 'asc' } // Urutkan berdasarkan NIS
    });
  }
}