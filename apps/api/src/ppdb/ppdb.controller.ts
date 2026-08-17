import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { PpdbService } from './ppdb.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ppdb')
export class PpdbController {
  constructor(private readonly ppdbService: PpdbService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.ppdbService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ppdbService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status_verifikasi?: any; status_kelulusan?: any }
  ) {
    return this.ppdbService.updateStatus(id, body);
  }

  // 🔥 ENDPOINT BARU: POST /ppdb/:id/generate-account
  @UseGuards(JwtAuthGuard)
  @Post(':id/generate-account')
  generateAccount(@Param('id') id: string) {
    return this.ppdbService.generateStudentAccount(id);
  }
}