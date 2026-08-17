import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Post()
  create(@Body() body: { nama_mapel: string }) {
    return this.subjectsService.create(body);
  }
}