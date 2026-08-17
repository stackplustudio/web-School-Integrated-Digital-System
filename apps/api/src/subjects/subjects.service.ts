import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subject.findMany({
      orderBy: { nama_mapel: 'asc' },
    });
  }

  async create(data: { nama_mapel: string }) {
    // Cek apakah mapel dengan nama tersebut sudah ada (Case Insensitive jika memungkinkan, tapi kita pakai standar dulu)
    const existingSubject = await this.prisma.subject.findFirst({
      where: { nama_mapel: data.nama_mapel }
    });

    if (existingSubject) {
      throw new BadRequestException(`Mata pelajaran ${data.nama_mapel} sudah ada di sistem.`);
    }

    const newSubject = await this.prisma.subject.create({
      data: {
        nama_mapel: data.nama_mapel,
      },
    });

    return {
      message: 'Mata pelajaran berhasil ditambahkan!',
      subject: newSubject,
    };
  }
}