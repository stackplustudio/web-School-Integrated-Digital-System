import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Post()
  create(@Body() body: { nama_kelas: string; waliKelasId: string }) {
    return this.classesService.create(body);
  }
}