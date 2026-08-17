import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  // Menarik semua user yang memiliki role GURU
  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'GURU' as any }, // Pastikan role GURU ada di enum Role Anda
      orderBy: { name: 'asc' },
    });
  }

  // Membuat akun Guru baru
  async create(data: { name: string; email: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar di sistem!');
    }

    // Buat password default
    const plainPassword = 'Guru1234!'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newTeacher = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'GURU' as any,
      }
    });

    return {
      message: 'Akun Guru berhasil dibuat!',
      user: newTeacher,
      defaultPassword: plainPassword
    };
  }
}