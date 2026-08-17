import { Controller, Get, Post, Body, Query, Request, UseGuards } from '@nestjs/common';
import { LmsService } from './lms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lms')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Get('classes')
  getMyClasses(@Request() req: any) { // 🔥 Diperbaiki di sini
    return this.lmsService.getMyClasses(req.user.id, req.user.role);
  }

  @Get('materials')
  getMaterials(@Query('classId') classId: string, @Query('subjectId') subjectId: string) {
    return this.lmsService.getMaterials(classId, subjectId);
  }

  @Post('materials')
  createMaterial(@Body() body: any) {
    return this.lmsService.createMaterial(body);
  }

  @Get('assignments')
  getAssignments(@Query('classId') classId: string, @Query('subjectId') subjectId: string) {
    return this.lmsService.getAssignments(classId, subjectId);
  }

  @Post('assignments')
  createAssignment(@Body() body: any) {
    return this.lmsService.createAssignment(body);
  }
}