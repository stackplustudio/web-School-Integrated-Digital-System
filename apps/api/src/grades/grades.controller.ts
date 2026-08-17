import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('components')
  getComponents() {
    return this.gradesService.getComponents();
  }

  @Post('components')
  createComponent(@Body() body: any) {
    return this.gradesService.createComponent(body);
  }

  @Get('students')
  getStudentsForGrading(
    @Query('classId') classId: string, 
    @Query('subjectId') subjectId: string,
    @Query('componentId') componentId: string
  ) {
    return this.gradesService.getStudentsForGrading(classId, subjectId, componentId);
  }

  @Post('save')
  saveGrades(@Body() body: any) {
    return this.gradesService.saveGrades(body);
  }

  @Get('report-card')
  getReportCard(@Query('classId') classId: string, @Query('studentId') studentId: string) {
    return this.gradesService.getReportCard(classId, studentId);
  }
}