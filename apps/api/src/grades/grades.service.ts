import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  // Memastikan ada entitas School untuk menghindari error Foreign Key
  private async ensureSchool() {
    let school = await this.prisma.school.findFirst();
    if (!school) {
      school = await this.prisma.school.create({
        data: { 
          nama_sekolah: 'Sekolah StackPlus', // Sesuaikan dengan skema
          alamat: 'Jakarta Selatan',
          jenjang: 'SMA' // Field ini wajib diisi sesuai skema Anda
        }
      });
    }
    return school;
  }

  // --- KOMPONEN NILAI ---
  async getComponents() {
    return this.prisma.gradeComponent.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async createComponent(data: { nama: string; bobot_persen: number }) {
    const school = await this.ensureSchool();
    return this.prisma.gradeComponent.create({
      data: {
        nama: data.nama,
        bobot_persen: parseFloat(data.bobot_persen.toString()),
        schoolId: school.id,
      }
    });
  }

  // --- INPUT NILAI ---
  async getStudentsForGrading(classId: string, subjectId: string, componentId: string) {
    const activeYear = await this.prisma.academicYear.findFirst({ where: { status_aktif: true } });
    if (!activeYear) throw new BadRequestException('Tahun ajaran aktif tidak ditemukan.');

    // 1. Ambil Siswa di Kelas tersebut
    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { classId, academicYearId: activeYear.id },
      include: { student: true },
      orderBy: { student: { nama: 'asc' } }
    });

    // 2. Ambil Nilai yang sudah ada (Filter otomatis berdasarkan ID Siswa yang ada di kelas tadi)
    const gradesByStudent = await this.prisma.grade.findMany({
      where: {
        subjectId,
        gradeComponentId: componentId,
        academicYearId: activeYear.id,
        studentId: { in: enrollments.map(e => e.studentId) } // Ini pencarian yang benar!
      }
    });

    const gradeMap = new Map();
    gradesByStudent.forEach(g => gradeMap.set(g.studentId, g.nilai));

    return enrollments.map(e => ({
      studentId: e.studentId,
      nis: e.student.nis,
      nama: e.student.nama,
      nilai: gradeMap.get(e.studentId) || 0
    }));
  }

  async saveGrades(body: { classId: string; subjectId: string; componentId: string; records: { studentId: string; nilai: number }[] }) {
    const activeYear = await this.prisma.academicYear.findFirst({ where: { status_aktif: true } });
    if (!activeYear) throw new BadRequestException('Tahun ajaran aktif tidak ada.');

    // Hapus nilai lama untuk komponen & mapel ini pada siswa-siswa tersebut
    await this.prisma.grade.deleteMany({
      where: {
        subjectId: body.subjectId,
        gradeComponentId: body.componentId,
        academicYearId: activeYear.id,
        studentId: { in: body.records.map(r => r.studentId) }
      }
    });

    // Insert nilai baru
    const dataToInsert = body.records.map(record => ({
      studentId: record.studentId,
      subjectId: body.subjectId,
      academicYearId: activeYear.id,
      semester: activeYear.semester,
      gradeComponentId: body.componentId,
      nilai: parseFloat(record.nilai.toString()),
    }));

    await this.prisma.grade.createMany({ data: dataToInsert });
    return { message: 'Nilai berhasil disimpan!' };
  }

  // --- REKAP RAPOR ---
  async getReportCard(classId: string, studentId: string) {
    const activeYear = await this.prisma.academicYear.findFirst({ where: { status_aktif: true } });
    if (!activeYear) throw new BadRequestException('Tahun ajaran aktif tidak ada.');

    // Ambil data siswa & kelas
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    const cls = await this.prisma.class.findUnique({ where: { id: classId } });

    // Ambil semua nilai siswa pada tahun ajaran ini
    const allGrades = await this.prisma.grade.findMany({
      where: { studentId, academicYearId: activeYear.id },
      include: { subject: true, gradeComponent: true }
    });

    // Kelompokkan nilai per mata pelajaran dan hitung nilai akhir (berdasarkan bobot persen)
    const subjectMap = new Map<string, { nama_mapel: string; total_nilai: number; detail: any[] }>();

    for (const g of allGrades) {
      if (!subjectMap.has(g.subjectId)) {
        subjectMap.set(g.subjectId, { nama_mapel: g.subject.nama_mapel, total_nilai: 0, detail: [] });
      }
      
      const sub = subjectMap.get(g.subjectId)!;
      const nilaiAkhirKomponen = g.nilai * (g.gradeComponent.bobot_persen / 100);
      
      sub.total_nilai += nilaiAkhirKomponen;
      sub.detail.push({
        komponen: g.gradeComponent.nama,
        nilaiAsli: g.nilai,
        bobot: g.gradeComponent.bobot_persen,
        nilaiAkhir: nilaiAkhirKomponen
      });
    }

    // Ambil catatan wali kelas jika ada
    const reportCard = await this.prisma.reportCard.findFirst({
      where: { studentId, classId, academicYearId: activeYear.id }
    });

    return {
      student,
      classInfo: cls,
      academicYear: activeYear,
      grades: Array.from(subjectMap.values()),
      catatan_wali_kelas: reportCard?.catatan_wali_kelas || ''
    };
  }
}