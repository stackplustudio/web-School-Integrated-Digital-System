import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaveRequestsService {
  constructor(private prisma: PrismaService) {}

  // 1. Membuat Pengajuan Baru (Siswa)
  async createRequest(data: { studentId: string; tanggal: string; jenis: string; lampiran: string }) {
    return this.prisma.leaveRequest.create({
      data: {
        studentId: data.studentId,
        tanggal: new Date(data.tanggal),
        jenis: data.jenis as any, // 'SAKIT' | 'IZIN'
        lampiran: data.lampiran,
        status_approval: 'MENUNGGU',
      },
    });
  }

  // 2. Mengambil Daftar Pengajuan (Semua untuk Admin/Guru, Spesifik untuk Siswa)
  async getRequests(studentId?: string) {
    const where = studentId ? { studentId } : {};
    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        student: {
          select: { nama: true, nis: true, enrollments: { include: { class: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Update Status (Admin / Guru)
  async updateStatus(id: string, status: string) {
    if (!['DISETUJUI', 'DITOLAK'].includes(status)) {
      throw new BadRequestException('Status tidak valid');
    }
    
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status_approval: status as any },
    });
  }
}