import { Controller, Get, Post, Body, Query, Put, Param, UseGuards } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  createRequest(@Body() body: any) {
    return this.leaveRequestsService.createRequest(body);
  }

  @Get()
  getRequests(@Query('studentId') studentId: string) {
    return this.leaveRequestsService.getRequests(studentId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.leaveRequestsService.updateStatus(id, status);
  }
}