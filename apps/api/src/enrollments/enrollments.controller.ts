import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Menarik daftar siswa yang belum punya kelas
  @Get('unenrolled')
  getUnenrolledStudents() {
    return this.enrollmentsService.getUnenrolledStudents();
  }

  // Menarik detail kelas beserta siswanya
  @Get('class/:classId')
  getClassEnrollments(@Param('classId') classId: string) {
    return this.enrollmentsService.getClassEnrollments(classId);
  }

  // Memasukkan siswa ke kelas
  @Post()
  enrollStudent(@Body() body: { classId: string; studentId: string }) {
    return this.enrollmentsService.enrollStudent(body.classId, body.studentId);
  }
}