import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.teachersService.create(body);
  }
}