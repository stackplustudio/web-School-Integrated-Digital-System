import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardStatsService {
  constructor(private prisma: PrismaService) {}

  async getAdminOverview() {
    const totalSiswa = await this.prisma.student.count();
    
    const totalGuru = await this.prisma.user.count({
      where: { role: 'GURU' }
    });
    
    const totalKelas = await this.prisma.class.count();
    
    // Perbaikan nama tabel: pPDBRegistration
    const totalPendaftar = await this.prisma.pPDBPeriod.count();
    
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { status_aktif: true }
    });

    return {
      statistik: {
        totalSiswa,
        totalGuru,
        totalKelas,
        totalPendaftar
      },
      informasi_akademik: activeYear 
        ? `Tahun Ajaran ${activeYear.tahun_ajaran} - Semester${activeYear.semester}` 
        : 'Belum Ada Tahun Ajaran Aktif'
    };
  }
}