import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get('list')
  getAttendanceList(
    @Query('classId') classId: string, 
    @Query('subjectId') subjectId: string, 
    @Query('tanggal') tanggal: string
  ) {
    return this.attendancesService.getAttendanceList(classId, subjectId, tanggal);
  }

  @Post('save')
  saveAttendance(@Body() body: any) {
    return this.attendancesService.saveAttendance(body);
  }
}