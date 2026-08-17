import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { StudentPortalService } from './student-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('student-portal')
export class StudentPortalController {
  constructor(private readonly studentPortalService: StudentPortalService) {}

  @Get('dashboard')
  getDashboardData(@Request() req: any) {
    return this.studentPortalService.getDashboardData(req.user.id);
  }

  @Post('submissions')
  submitAssignment(@Request() req: any, @Body() body: any) {
    return this.studentPortalService.submitAssignment(req.user.id, body);
  }
}