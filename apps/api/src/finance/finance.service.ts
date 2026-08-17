import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // --- MASTER JENIS TAGIHAN ---
  async getBillingTypes() {
    return this.prisma.billingType.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createBillingType(data: { nama: string; nominal_default: number }) {
    return this.prisma.billingType.create({
      data: {
        nama: data.nama,
        nominal_default: parseFloat(data.nominal_default.toString())
      }
    });
  }

  // --- MANAJEMEN TAGIHAN (INVOICE) ---
  async getInvoices(studentId?: string) {
    const where = studentId ? { studentId } : {};
    return this.prisma.invoice.findMany({
      where,
      include: {
        student: { select: { nama: true, nis: true } },
        billingType: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createInvoice(data: { studentId: string; billingTypeId: string; periode: string; nominal: number; jatuh_tempo: string }) {
    return this.prisma.invoice.create({
      data: {
        studentId: data.studentId,
        billingTypeId: data.billingTypeId,
        periode: data.periode,
        nominal: parseFloat(data.nominal.toString()),
        jatuh_tempo: new Date(data.jatuh_tempo),
        status: 'BELUM_BAYAR' as any
      }
    });
  }

  // --- PEMBAYARAN ---
  async payInvoice(invoiceId: string, data: { jumlah: number; metode: string; bukti_url?: string }) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new BadRequestException('Tagihan tidak ditemukan');

    // Buat riwayat pembayaran
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        jumlah: parseFloat(data.jumlah.toString()),
        metode: data.metode,
        bukti_url: data.bukti_url
      }
    });

    // Ubah status menjadi LUNAS (Untuk kesederhanaan, asumsikan pembayaran penuh)
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'LUNAS' as any }
    });

    return payment;
  }
}