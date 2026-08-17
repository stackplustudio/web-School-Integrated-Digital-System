import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Validasi kredensial (Email, Password, & Status Active)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // PERBAIKAN: Pastikan user ada, statusnya ACTIVE, dan password cocok
    if (user && user.status === 'ACTIVE' && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Generate Tokens (Access & Refresh)
  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      name: user.name // PERBAIKAN: Menyertakan nama untuk frontend
    };

    // Access token untuk dikirim ke memory frontend
    const accessToken = this.jwtService.sign(payload);
    
    // Refresh token untuk disimpan di HTTP-Only Cookie (umur 7 hari)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-cahyodev',
      expiresIn: '7d',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name, // PERBAIKAN: Dikembalikan ke frontend
      },
      access_token: accessToken,
      refreshToken,
    };
  }
}