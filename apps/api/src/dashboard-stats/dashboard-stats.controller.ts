import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardStatsService } from './dashboard-stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard-stats')
export class DashboardStatsController {
  constructor(private readonly dashboardStatsService: DashboardStatsService) {}

  @Get('admin-overview')
  getAdminOverview() {
    return this.dashboardStatsService.getAdminOverview();
  }
}